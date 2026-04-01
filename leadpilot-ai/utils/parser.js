exports.parseMessage = (text) => {
  // Budget extraction - looks for patterns like "80L", "80 lakh", "1.5Cr", "1.5 Cr"
  // Avoid matching numbers followed by BHK (like 2BHK, 3BHK)
  const budgetPatterns = [
    /(\d+\.?\d*)\s*(Cr|crore)/i,  // 1.5Cr, 1.5 Cr, 1.5 crore
    /(\d+)\s*lakh/i,               // 80 lakh
    /(\d+)\s*L\b/i,                // 80L (word boundary to avoid matching in middle of words)
  ];
  
  let budget = null;
  for (const pattern of budgetPatterns) {
    const match = text.match(pattern);
    if (match) {
      const amount = match[1];
      const unit = match[2].toLowerCase();
      if (unit === 'cr' || unit === 'crore') {
        budget = `${amount}Cr`;
      } else {
        budget = `${amount}L`;
      }
      break;
    }
  }
  
  // Location extraction - looks for "in [City]" or "at [City]" or "near [City]"
  // Stop at budget-related words or numbers
  const locationMatch = text.match(/(?:in|at|near)\s+([a-zA-Z]+)(?:\s+(?:under|within|for|budget|\d+\s*(?:L|lakh|Cr)|\d+BHK))?/i);

  // Clean up location
  let location = locationMatch ? locationMatch[1].trim() : null;

  return {
    budget: budget,
    location: location,
  };
};
