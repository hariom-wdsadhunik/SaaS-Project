const fs = require("fs");
const VERIFY_TOKEN = "leadpilot_token";
const { sendMessage } = require("../services/whatsappService");
const { parseMessage } = require("../utils/parser");
const { supabase } = require("../db/supabase");
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

      // 🔍 Parse lead info
      const parsed = parseMessage(text);
      console.log("Parsed:", parsed);

      // 🎯 AI Lead Scoring
      const leadData = {
        phone,
        message: text,
        budget: parsed.budget,
        location: parsed.location
      };
      const scoreData = leadScoringService.calculateScore(leadData);
      console.log("AI Score:", scoreData);

      // 💾 Save lead to file (backup)
      const lead = {
        phone,
        message: text,
        budget: parsed.budget,
        location: parsed.location,
        ai_score: scoreData.totalScore,
        ai_priority: scoreData.priority,
        time: new Date()
      };
      fs.appendFileSync("leads.json", JSON.stringify(lead) + "\n");

      // 💾 Save lead to Supabase with AI score
      let savedLead;
      try {
        const { data, error } = await supabase.from("leads").insert([
          {
            phone: phone,
            message: text,
            budget: parsed.budget,
            location: parsed.location,
            status: "new",
            ai_score: scoreData.totalScore,
            ai_priority: scoreData.priority,
            ai_insights: scoreData.aiInsights,
            source: "whatsapp",
            created_at: new Date()
          }
        ]).select().single();

        if (error) throw error;
        savedLead = data;
        console.log("Lead saved to DB with AI score:", scoreData.totalScore);
      } catch (err) {
        console.error("Supabase insert failed:", err.message);
      }

      // 📧 Send email notification to team members
      try {
        // Get users who want notifications
        const { data: notificationUsers } = await supabase
          .from('users')
          .select('email')
          .eq('email_notifications', true);

        if (notificationUsers && savedLead) {
          for (const user of notificationUsers) {
            // Send high priority alert for hot leads
            if (scoreData.priority === 'hot') {
              await emailService.sendHighPriorityAlert(user.email, savedLead, scoreData);
            } else {
              await emailService.sendNewLeadNotification(user.email, savedLead, scoreData);
            }
          }
        }
      } catch (err) {
        console.error("Email notification failed:", err.message);
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
