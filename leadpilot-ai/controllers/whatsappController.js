const fs = require("fs");
const VERIFY_TOKEN = "leadpilot_token";
const { sendMessage } = require("../services/whatsappService");
const { parseMessage } = require("../utils/parser");
const supabase = require("../db/supabase");

exports.verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
};

exports.handleMessage = async (req, res) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const phone = message.from;
      const text = message.text?.body;

      console.log("New message:", phone, text);

      // 🔍 Parse lead info
      const parsed = parseMessage(text);
      console.log("Parsed:", parsed);

      // 💾 Save lead to file (backup)
      const lead = {
        phone,
        message: text,
        budget: parsed.budget,
        location: parsed.location,
        time: new Date()
      };
      fs.appendFileSync("leads.json", JSON.stringify(lead) + "\n");

      // 💾 Save lead to Supabase
      try {
        await supabase.from("leads").insert([
          {
            phone: phone,
            message: text,
            budget: parsed.budget,
            location: parsed.location,
            status: "new"
          }
        ]);

        console.log("Lead saved to DB");
      } catch (err) {
        console.error("Supabase insert failed:", err.message);
      }

      // 🔥 Auto reply
      try {
        await sendMessage(
          phone,
          "Hi 👋 Thanks for reaching out. I'll share details shortly."
        );
      } catch (err) {
        console.log("Auto-reply skipped (Meta not connected yet)");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
};
