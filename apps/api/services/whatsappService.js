const axios = require("axios");

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_ID;

exports.sendMessage = async (to, message) => {
  await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
};
