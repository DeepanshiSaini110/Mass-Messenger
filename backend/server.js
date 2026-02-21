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
const fs = require("fs");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/* ================= MONGODB ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ Mongo Error:", err);
    process.exit(1);
  });

/* ================= MODELS ================= */

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  })
);

const Recipient = mongoose.model(
  "Recipient",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: String,
    phone: String,
    createdAt: { type: Date, default: Date.now },
  })
);

const MessageLog = mongoose.model(
  "MessageLog",
  new mongoose.Schema({
    channel: String,
    title: String,
    message: String,
    recipients: [String],
    createdAt: { type: Date, default: Date.now },
  })
);

/* ================= FILE UPLOAD (SINGLE SOURCE) ================= */

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) =>
      cb(null, Date.now() + "-" + file.originalname),
  }),
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

/* ================= AUTH ================= */

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, email } });
  } catch {
    res.status(500).json({ message: "Server error" });
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
            attachments: req.file ? [{ path: req.file.path }] : [],
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
    const { name, email, phone } = req.body;
    if (!name || (!email && !phone)) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const recipient = await Recipient.create({ name, email, phone });
    res.json(recipient);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/api/recipients/import-csv",
  upload.single("file"),
  async (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        const saved = [];
        for (const r of results) {
          if (!r.name || (!r.email && !r.phone)) continue;
          saved.push(
            await Recipient.create({
              name: r.name.trim(),
              email: r.email?.trim(),
              phone: r.phone?.trim(),
            })
          );
        }
        fs.unlinkSync(req.file.path);
        res.json(saved);
      });
  }
);

app.get("/api/recipients", async (req, res) => {
  res.json(await Recipient.find().sort({ createdAt: -1 }));
});

app.delete("/api/recipients/:id", async (req, res) => {
  await Recipient.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= LOGS ================= */

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await MessageLog.find().sort({ createdAt: -1 });

    res.json(
      logs.map(log => ({
        _id: log._id,
        timestamp: log.createdAt.toLocaleString(),
        channel: log.channel,
        recipients: log.recipients,   // ✅ ARRAY hi bhejo
        message: log.message,
        status: "Delivered"
      }))
    );
  } catch (err) {
    console.error("GET LOGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DASHBOARD ================= */

app.get("/api/dashboard-stats", async (req, res) => {
  const totalRecipients = await Recipient.countDocuments();
  const totalMessages = await MessageLog.countDocuments();

  res.json({
    activeRecipients: totalRecipients,
    messagesSent: totalMessages,
    deliveryRate: totalMessages ? "95%" : "0%",
    openRate: totalMessages ? "70%" : "0%",
  });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);