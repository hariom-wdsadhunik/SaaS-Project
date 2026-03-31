exports.parseMessage = (text) => {
  const budgetMatch = text.match(/\d+L|\d+ lakh|\d+/i);
  const locationMatch = text.match(/in ([a-zA-Z ]+)/i);

  return {
    budget: budgetMatch ? budgetMatch[0] : null,
    location: locationMatch ? locationMatch[1] : null,
  };
};
