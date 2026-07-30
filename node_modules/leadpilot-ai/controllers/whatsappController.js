const fs = require("fs");
const VERIFY_TOKEN = "leadpilot_token";
const { sendMessage } = require("../services/whatsappService");
const { parseMessage } = require("../utils/parser");
const repository = require("../db");
const leadScoringService = require("../services/leadScoringService");
const emailService = require("../services/emailService");

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

      // Parse lead info
      const parsed = parseMessage(text);
      console.log("Parsed:", parsed);

      // AI Lead Scoring
      const leadData = {
        phone,
        message: text,
        budget: parsed.budget,
        location: parsed.location
      };
      const scoreData = leadScoringService.calculateScore(leadData);
      console.log("AI Score:", scoreData);

      // Save lead to file (backup)
      const lead = {
        phone,
        message: text,
        budget: parsed.budget,
        location: parsed.location,
        ai_score: scoreData.totalScore,
        ai_priority: scoreData.priority,
        time: new Date()
      };
      try {
        fs.appendFileSync("leads.json", JSON.stringify(lead) + "\n");
      } catch (fErr) {
        console.error("Backup file append skipped:", fErr.message);
      }

      // Save lead using repository
      let savedLead;
      try {
        savedLead = await repository.createLead({
          phone: phone,
          message: text,
          budget: parsed.budget,
          location: parsed.location,
          status: "new",
          ai_score: scoreData.totalScore,
          ai_priority: scoreData.priority,
          ai_insights: scoreData.aiInsights,
          source: "whatsapp",
          created_at: new Date().toISOString()
        });
        console.log("Lead saved via repository with AI score:", scoreData.totalScore);
      } catch (err) {
        console.error("Repository insert failed:", err.message);
      }

      // Send email notification if configured
      try {
        const user = await repository.getUserById("user-1");
        if (user?.email && savedLead) {
          if (scoreData.priority === 'hot') {
            await emailService.sendHighPriorityAlert(user.email, savedLead, scoreData);
          } else {
            await emailService.sendNewLeadNotification(user.email, savedLead, scoreData);
          }
        }
      } catch (err) {
        console.error("Email notification failed:", err.message);
      }

      // Auto reply
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
