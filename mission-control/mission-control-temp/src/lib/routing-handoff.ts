export const ROUTING_HANDOFF = {
    triggers: [
        "High Intent (e.g., 'That sounds interesting', 'How does it work?')",
        "Supervisor Request (e.g., 'Can I speak to your manager?', 'Is there a human there?')"
    ],
    script: {
        transfer: "That's a great question. I'd love to get my colleague who specializes in that on the line. One moment while I connect you.",
        fallback: "It looks like my colleagues are currently tied up. But I definitely want to make sure you get those answers. I can book a time on their calendar right now—does Tuesday at 10 AM or 2 PM work better for you?"
    },
    systemPromptAddon: `
    ROUTING & HANDOFF INSTRUCTIONS:
    Identify High Intent or Requests for a Human.
    
    IF the user expresses strong interest OR asks for a human:
    1.  Say: "That's a great question. I'd love to get my colleague who specializes in that on the line. One moment while I connect you."
    2.  [ACTION: ATTEMPT_TRANSFER]
    
    IF the transfer fails (simulated unavailable):
    1.  Immediately Pivot: "It looks like my colleagues are currently tied up. But I definitely want to make sure you get those answers. I can book a time on their calendar right now—does Tuesday at 10 AM or 2 PM work better for you?"
    
    POST-CALL:
    - You must tag the call with "Handoff Requested" and the "Reason" (e.g., "High Intent", "Supervisor Request").
  `
};
