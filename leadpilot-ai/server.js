require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const webhookRoutes = require("./routes/webhook");
const leadsRoutes = require("./routes/leads");
const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const analyticsRoutes = require("./routes/analytics");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// API Routes
app.use("/webhook", webhookRoutes);
app.use("/leads", leadsRoutes);
app.use("/auth", authRoutes);
app.use("/team", teamRoutes);
app.use("/analytics", analyticsRoutes);

// Serve landing page as default
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/landing.html");
});

// Serve dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/dashboard-pro.html");
});

// Serve landing page explicitly
app.get("/landing", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/landing.html");
});

// Serve analytics page
app.get("/analytics.html", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/analytics.html");
});

// Serve login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/login.html");
});

app.get("/login.html", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/login.html");
});

// Serve register page
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/register.html");
});

app.get("/register.html", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/register.html");
});

const PORT = process.env.PORT || 3000;

// Export for Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
