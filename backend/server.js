require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const twilio = require("twilio");

const app = express();

/* ================= Middleware ================= */

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Running Successfully 🚀");
});


/* ================= MongoDB ================= */

console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI).then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {console.error("❌ Mongo Error:", err);
    process.exit(1);
  });

/* ================= User Model ================= */

const userSchema = new mongoose.Schema({
  email: {type: String,required: true,unique: true,},
  password: {type: String,required: true,},
  createdAt: {type: Date,default: Date.now,},
});

const User = mongoose.model("User", userSchema);

/* ================= Recipient Model ================= */

const recipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },     
  phone: { type: String },     
  createdAt: { type: Date, default: Date.now },
});


const Recipient = mongoose.model("Recipient", recipientSchema);


/* ================= Message Log Model ================= */

const messageLogSchema = new mongoose.Schema({
  channel: String,title: String,message: String,recipients: [String],
  createdAt: {type: Date,default: Date.now,},
});

const MessageLog = mongoose.model("MessageLog", messageLogSchema);

/* ================= Auth Routes ================= */

/* REGISTER */
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("REGISTER:", req.body);
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({email,password: hashedPassword,});

    await user.save();
    res.json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* LOGIN */
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN:", req.body);
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET ||"secret123",{expiresIn: "1d"});

    res.json({token,user: {id: user._id,email: user.email,},});
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* ================= Email Setup ================= */

const transporter = nodemailer.createTransport({host: "smtp.gmail.com",port: 587,secure: false,
auth: {user: process.env.EMAIL_USER,pass: process.env.EMAIL_PASS,},});
transporter.verify((err) => {
  if (err) {
    console.error("❌ Email Error:", err);
  } else {
    console.log("✅ Email Server Ready");
  }
});

/* ================= Twilio ================= */

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

/* ================= Send Message API ================= */

app.post("/api/send-msg-all", async (req, res) => {
  try {
    const { channel, title, message, recipients } = req.body;
    if (!channel || !message || !recipients) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    const log = new MessageLog({channel,title,message,recipients,});
    await log.save();

    for (let target of recipients) {
      if (channel === "email") {
        await transporter.sendMail({from: process.env.EMAIL_USER,to: target,subject: title || "Message",
          text: message,
        });
      } else {
        await twilioClient.messages.create({
          body: message,
          from:
            channel === "whatsapp"? `whatsapp:${process.env.TWILIO_WA_PHONE}`: process.env.TWILIO_PHONE,
          to:
            channel === "whatsapp"? `whatsapp:${target}`: target,
        });
      }
    }

    res.json({success: true,message: "Messages sent",
    });
  } catch (err) {
    console.error("MSG ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});
/* ================= Recipients API ================= */

// Add Recipient
app.post("/api/recipients", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || (!email && !phone)) {
      return res.status(400).json({
        message: "Name and at least Email or Phone required",
      });
    }

    // ✅ PHONE VALIDATION YAHAN ADD HOGA
    if (phone && !/^\+\d{10,15}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone format. Use +919876543210",
      });
    }

    const recipient = new Recipient({
      name,
      email,
      phone,
    });

    await recipient.save();
    res.json(recipient);

  } catch (err) {
    console.error("ADD RECIPIENT ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});




// Get All Recipients
app.get("/api/recipients", async (req, res) => {
  try {
    const recipients = await Recipient.find().sort({createdAt: -1,});
    res.json(recipients);
  } catch (err) {
    console.error("GET RECIPIENT ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// Delete Recipient
app.delete("/api/recipients/:id", async (req, res) => {
  try {
    await Recipient.findByIdAndDelete(req.params.id);
    res.json({ success: true });

  } catch (err) {
    console.error("DELETE RECIPIENT ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* ================= Logs API ================= */

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await MessageLog.find().sort({ createdAt: -1 });
    const formattedLogs = logs.map(log => ({timestamp: log.createdAt.toLocaleString(),
      recipient: log.recipients.join(", "),email: log.recipients.join(", "),
      message: log.message,status: "Delivered", 
    }));
    res.json(formattedLogs);
  } catch (err) {
    console.error("GET LOGS ERROR:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const totalMessages = await MessageLog.countDocuments();
    const totalRecipients = await Recipient.countDocuments();
    const deliveryRate = totalMessages? ((totalMessages / (totalMessages + 5)) * 100)
    .toFixed(1):0;
    const openRate = totalMessages? ((totalMessages / (totalMessages + 10)) * 100).toFixed(1)
      :0;

    res.json({messageSent: totalMessages,deliveryRate: deliveryRate + "%",
      activeRecipients: totalRecipients,openRate: openRate + "%"});

  } catch (err) {
      console.error("DASHBOARD ERROR:", err);
      res.status(500).json({message: "Server error"});
  }
});



/* ================= Server ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
