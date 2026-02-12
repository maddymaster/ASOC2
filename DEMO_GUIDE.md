# Mission Control - Demo Guide 🚀

This guide walks you through presenting the Mission Control platform to customers.

## 1. The Hook (Landing Page)
**URL**: `http://localhost:3000/`

*   **Action**: Scroll through the page. Hover over "Features".
*   **Script**: "Sales development is broken. Teams spend 70% of their time on admin work. Mission Control is the AI-first platform that automates the entire outbound stack—from lead gen to voice calls."
*   **Action**: Click **"Get Started"** (or Sign In).

## 2. Frictionless Onboarding (Auth)
**URL**: `/login`

*   **Action**: Enter *any* email (e.g., `demo@company.com`) and click **Sign In**.
*   **Observation**: Watch the "Magic Link" simulation.
*   **Script**: "We use passwordless, magic-link auth for security and ease of use. You're dropped straight into your workspace."

## 3. The Dashboard (Command Center)
**URL**: `/dashboard` (Redirects automatically)

*   **Action**: Point out the 3 main tabs: **Lead Gen**, **Email**, **Calls**.
*   **Script**: "This is your Mission Control. It aggregates leads, campaigns, and voice analytics in one place."

### A. AI Strategy Generation
1.  **Tab**: `Lead Gen`.
2.  **Action**: Open the **Chat** (Assistant).
3.  **Prompt**: "Find software companies in New York with 11-50 employees."
4.  **Action**: Click **Settings** (Gear Icon). Show that you can input a *Real Apollo Key* for live data, or use the built-in verified database.
5.  **Script**: "Our AI doesn't just list leads; it understands your ICP. We integrate directly with Apollo to fetch live data."

### B. Human-Like Email Campaigns
1.  **Tab**: `Email`.
2.  **Action**: Ask Chat: "Draft intro emails for these leads."
3.  **Observation**: Watch emails appear in the queue.
4.  **Action**: Click **"Start Campaign (Throttled)"**.
5.  **Script**: "Notice the 'Throttled' badge. We don't blast emails. We send them one by one with random delays to mimic human behavior and ensure high deliverability."

### C. Voice AI & Coaching (The "Wow" Factor)
1.  **Tab**: `Calls`.
2.  **Action**: Click **"Simulate Inbound Call"**.
3.  **Observation**: Watch the live call tracker.
4.  **Action**: Click **"Review"** on a completed call.
5.  **Script**: "After every call, our AI analyzes the transcript. It gives the agent a 'Win', a 'Gap', and a Score using the ASOC Sales Framework. It's like having a manager listen to every single call."

## 4. Closing
*   **Action**: Return to the Landing Page.
*   **Script**: "Mission Control isn't just a tool; it's your 24/7 autonomous sales team."

---

## Technical Notes for Demo
- **Credentials**: If you want real emails to send, set SMTP credentials in the **Settings** gear before clicking "Start Campaign".
- **Reset**: To clear data, just refresh the page (state is mostly client-side for the demo session) or run `npm run db:reset` if using the persistent DB.
