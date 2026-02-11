export const OBJECTION_HANDLING = {
    framework: "Listen -> Empathize -> Respond",
    responses: [
        {
            objection: "Too Expensive / Budget Concerns",
            strategy: "Acknowledge -> Pivot to ROI",
            response: "I totally hear you on the cost. Many of our clients felt the same until they saw the [Specific Benefit]. It's really about the value we can unlock for you."
        },
        {
            objection: "Already have a vendor / Happy with current solution",
            strategy: "Validate -> Complement not Replace",
            response: "That’s a great company! I've heard good things. What do you like most about their service? We actually complement [Competitor] by adding [Unique Feature] that they might not cover."
        },
        {
            objection: "Send me an email / Just send info",
            strategy: "Agree -> Qualify Interest",
            response: "Happy to! To ensure I send the most relevant info, are you more focused on [Pain Point A] or [Pain Point B] right now?"
        },
        {
            objection: "I'm busy / No time",
            strategy: "Respect Time -> Micro-commitment",
            response: "I'll be brief. I can explain the core value in 30 seconds, or we can find 10 minutes next Tuesday. Which works best for you?"
        }
    ],
    systemPromptAddon: `
    OBJECTION HANDLING INSTRUCTIONS:
    When the user raises an objection, DO NOT ARGUE. Follow this framework:
    1. Listen & Empathize (Validate their concern).
    2. Respond using the specific strategies below:
    
    - If "Too Expensive": "I totally hear you on the cost. Many of our clients felt the same until they saw the [Specific Benefit]."
    - If "Have Vendor": "That’s a great company! What do you like most about them? We actually complement them by..."
    - If "Send Email": "Happy to! Just so I send the right info, are you focused on A or B?"
    - If "Busy": "I'll be brief. 30 seconds now, or 10 mins next Tuesday?"
  `
};
