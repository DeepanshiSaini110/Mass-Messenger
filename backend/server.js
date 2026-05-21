require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const multer = require("multer");
const csv = require("csv-parser");

const app = express();

// const http = require("http");

// const { Server } = require("socket.io");

// const server = http.createServer(app);

const allowedOrigins = [
  "https://mass-messenger-up3h.vercel.app",
  "https://mass-messenger-up3h-g96gz5a77-deepanshisaini110s-projects.vercel.app"
];

// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true
//   }
// });

/* ================= MIDDLEWARE ================= */

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: function(origin, callback) {

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }

    },
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
  })
);
app.options(/.*/, cors({
  origin: allowedOrigins,
  credentials: true
}));



app.use(express.json());
// io.on("connection", (socket) => {

//   console.log("User Connected");

//   socket.on("disconnect", () => {

//     console.log("User Disconnected");

//   });

// });
/* ================= MONGODB ================= */

if (!global.mongooseConn) {

  global.mongooseConn =
    mongoose.connect(
      process.env.MONGO_URI
    )
      .then(() =>
        console.log(
          "✅ MongoDB Connected"
        )
      )
      .catch(err =>
        console.error(
          "❌ Mongo Error:",
          err
        )
      );

}



/* ================= MODELS ================= */

const User = mongoose.models.User || mongoose.model(
  "User",
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  })
);

const Recipient =
  mongoose.models.Recipient ||
  mongoose.model(
    "Recipient",
    new mongoose.Schema({
      name: {
        type:String,
        required:true
      },
      email:String,
      phone:String,
      createdAt:{
        type:Date,
        default:Date.now
      }
    })
  );
const MessageLog =
  mongoose.models.MessageLog ||
  mongoose.model(
    "MessageLog",
    new mongoose.Schema({
      channel:String,
      title:String,
      message:String,
      recipients:[String],
      createdAt:{
        type:Date,
        default:Date.now
      }
    })
  );

/* ================= FILE UPLOAD (SINGLE SOURCE) ================= */

const upload = multer({
  storage: multer.memoryStorage()
});
/* ================= EMAIL ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(() => console.log("✅ Email Ready"));

/* ================= TWILIO ================= */

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);
/* ================= AUTH Register ================= */
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashed,
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
  });

  }
});

/* ================= AUTH ================= */

app.post("/auth/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user =
      await User.findOne({ email });

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }
});

/* ================= SEND MESSAGE (FIXED) ================= */

app.post(
  "/api/send-msg-all",
  upload.single("attachment"),   // ✅ attachment optional
  async (req, res) => {
    try {
      const { channel, title, message } = req.body;

      if (!req.body.recipients) {
        return res.status(400).json({ error: "Recipients missing" });
      }

      let recipients;
      try {
        recipients = JSON.parse(req.body.recipients);
      } catch {
        return res.status(400).json({ error: "Invalid recipients format" });
      }

      if (!channel || !message || recipients.length === 0) {
        return res.status(400).json({ error: "Missing fields" });
      }

      await MessageLog.create({
        channel,
        title,
        message,
        recipients,
      });

      for (const to of recipients) {
        if (channel === "email") {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: title || "Message",
            text: message,
            attachments:
  req.file
    ? [{
        filename:
          req.file.originalname,
        content:
          req.file.buffer
      }]
    : [],
          });
        } else {
          await twilioClient.messages.create({
            body: message,
            from:
              channel === "whatsapp"
                ? `whatsapp:${process.env.TWILIO_WA_PHONE}`
                : process.env.TWILIO_PHONE,
            to:
              channel === "whatsapp"
                ? `whatsapp:${to}`
                : to,
          });
        }
      }
      // io.emit("new_notification", {
      //   text: "New campaign sent successfully"
      // });

      res.json({ success: true, message: "Messages sent successfully" });

    } catch (err) {
      console.error("SEND MSG ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ================= RECIPIENTS ================= */

app.post("/api/recipients", async (req, res) => {

  try {

    const { name, email, phone } =
      req.body;

    if (
      !name ||
      (!email && !phone)
    ) {
      return res.status(400).json({
        message:"Invalid data"
      });
    }

    const recipient =
      await Recipient.create({
        name,
        email,
        phone
      });

    res.json(recipient);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }

});
app.post(
  "/api/recipients/import-csv",
  upload.single("file"),
  async (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "CSV file required"
      });
    }

    const stream = require("stream");

    const results = [];

    const readable =
      stream.Readable.from(
        req.file.buffer
      );

    readable
      .pipe(csv())
      .on("data", row =>
        results.push(row)
      )
      .on("end", async () => {

        const saved = [];

        for (const r of results) {

          if (
            !r.name &&
            !r.email &&
            !r.phone
          ) continue;

          saved.push(
            await Recipient.create({
              name:
                r.name?.trim(),
              email:
                r.email?.trim(),
              phone:
                r.phone?.trim()
            })
          );

        }

        res.json(saved);

      });

  }
);

app.get("/api/recipients", async (req, res) => {
  res.json(await Recipient.find().sort({ createdAt: -1 }));
});
app.delete(
  "/api/recipients/:id",
  async (req, res) => {

    try {

      await Recipient
        .findByIdAndDelete(
          req.params.id
        );

      res.json({
        success: true
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message:
          err.message
      });

    }

  }
);


/* ================= LOGS ================= */

app.get("/api/logs", async (req, res) => {
  try {

    const logs = await MessageLog.find()
      .sort({ createdAt: -1 });

    res.json(

      logs.map(log => ({

        _id: log._id.toString(),

        timestamp:
          log.createdAt.toLocaleString(),

        channel: log.channel,

        recipients: log.recipients,

        title: log.title,

        message: log.message,

        status: "Delivered"

      }))

    );

  } catch (err) {

    console.error("GET LOGS ERROR:", err);

    res.status(500).json({
      message: "Server error"
    });

  }
});
// DELETE single message log
app.delete("/api/logs/:id", async (req, res) => {
  try {
    const deleted = await MessageLog.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: "Invalid log ID" });
  }
});
// DELETE all message history
app.delete("/api/logs", async (req, res) => {
  try {
    await MessageLog.deleteMany({});
    res.json({ success: true, message: "All history cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear history" });
  }
});
const ExcelJS = require("exceljs");

// DOWNLOAD logs as Excel
app.get("/api/logs/export/excel", async (req, res) => {
  try {
    const logs = await MessageLog.find().sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Message Logs");

    // Columns
    worksheet.columns = [
      { header: "Timestamp", key: "timestamp", width: 25 },
      { header: "Channel", key: "channel", width: 15 },
      { header: "Recipients Count", key: "recipientsCount", width: 20 },
      { header: "Recipients", key: "recipients", width: 40 },
      { header: "Message", key: "message", width: 50 },
      { header: "Status", key: "status", width: 15 },
    ];

    // Rows
    logs.forEach(log => {
      worksheet.addRow({
        timestamp: log.createdAt.toLocaleString(),
        channel: log.channel.toUpperCase(),
        recipientsCount: log.recipients.length,
        recipients: log.recipients.join(", "),
        message: log.message,
        status: "Delivered",
      });
    });

    // Header styling
    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=message_logs.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("EXCEL EXPORT ERROR:", err);
    res.status(500).json({ message: "Failed to export logs" });
  }
});

/* ================= DASHBOARD ================= */

app.get("/api/dashboard-stats", async (req, res) => {

  try {

    const totalRecipients =
      await Recipient.countDocuments();

    const totalMessages =
      await MessageLog.countDocuments();

    // Example analytics

    const deliveryRate =
      totalMessages ? 98.5 : 0;

    const openRate =
      totalMessages ? 70.5 : 0;

    res.json({

      messagesSent: totalMessages,

      deliveryRate,

      activeRecipients: totalRecipients,

      openRate

    });

  } catch (err) {

    console.log(
      "Dashboard Stats Error:",
      err
    );

    res.status(500).json({
      message: "Server Error"
    });

  }

});
/* ================= SERVER ================= */


module.exports = app;