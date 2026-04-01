require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const webhookRoutes = require("./routes/webhook");
const leadsRoutes = require("./routes/leads");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/webhook", webhookRoutes);
app.use("/leads", leadsRoutes);

// Serve dashboard from leadpilot-ui
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/dashboard.html");
});

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/leadpilot-ui/dashboard.html");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
