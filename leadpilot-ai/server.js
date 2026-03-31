require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const webhookRoutes = require("./routes/webhook");
const leadsRoutes = require("./routes/leads");

const app = express();
app.use(bodyParser.json());

app.use("/webhook", webhookRoutes);
app.use("/leads", leadsRoutes);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
