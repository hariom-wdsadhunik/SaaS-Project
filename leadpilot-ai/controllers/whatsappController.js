const VERIFY_TOKEN = "leadpilot_token";
const { sendMessage } = require("../services/whatsappService");

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

      // 🔥 Auto reply
      await sendMessage(
        phone,
        "Hi 👋 Thanks for reaching out. I'll share details shortly."
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
};
