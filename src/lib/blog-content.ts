export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    category: string;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    content: string; // Markdown content
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "beyond-0-10-architecture",
        title: "Beyond $0.10/min: The Architecture of Sub-Second Latency in AI Sales",
        description: "Why we chose a hybrid voice stack with Retell AI and Vapi AI to achieve <800ms response times.",
        date: "Feb 18, 2026",
        readTime: "6 min read",
        category: "Technical Deep Dive",
        author: {
            name: "Alex Chen",
            role: "Senior DevOps Engineer",
            avatar: "/assets/avatars/alex.jpg" // Placeholder
        },
        content: `
# The Latency Imperative

In AI voice sales, latency isn't just a metric—it's the difference between a conversation and a robotic interrogation. If an agent takes 2 seconds to respond, the prospect hangs up. 

At **MissionControl**, we obsessed over this. We didn't just wrap an API; we built a **hybrid voice stack** designed for sub-second performance.

## The Stack: Retell vs. Vapi

We leverage the best of breed:

*   **Retell AI ($0.12-$0.16/min)**: Our workhorse for rapid, stable, high-concurrency outbound dialing. It handles the telephony edge cases beautifully.
*   **Vapi AI ($0.10/min)**: Used for highly custom, developer-led flows where we need granular control over the function calling loop.

## The Architecture

\`\`\`mermaid
graph TD
    A[Apollo.io Signal] -->|Webhook| B(MissionControl Core)
    B -->|Select Agent| C{Router}
    C -->|Standard| D[Retell AI SDK]
    C -->|Custom Logic| E[Vapi AI SDK]
    D -->|SIP/PSTN| F((Prospect))
    E -->|SIP/PSTN| F
    F -->|Voice Stream| G[Deepgram Nova-2]
    G -->|Text| H[GPT-4o]
    H -->|Function Call| I[Calendly API]
\`\`\`

## Function Calling for Closes

The magic happens when the AI needs to take action. We don't just prompt the LLM to "try to book a meeting." We give it tools.

Using **GPT-4 Function Calling**, our agents have direct access to:
1.  \`check_availability(email)\`: Pings the prospect's calendar (if public) or our SDR's calendar.
2.  \`book_slot(time)\`: Curls the Calendly API to lock in the meeting.

This reduces the "administrative gap" to zero. The meeting is booked before the call ends.
        `
    },
    {
        slug: "end-of-sdr-tax",
        title: "The End of the SDR Tax: Infrastructure-First Pricing in 2026",
        description: "Traditional agencies charge a 40% markup on tools you already use. It's time for transparent billing.",
        date: "Feb 15, 2026",
        readTime: "5 min read",
        category: "ROI & Economics",
        author: {
            name: "Sarah Jenkins",
            role: "Product Strategist",
            avatar: "/assets/avatars/sarah.jpg"
        },
        content: `
# The Hidden Markup

If you hire a traditional SDR agency today, you are paying for three things:
1.  **Human Labor**: Inefficient and burnout-prone.
2.  **Tool Stack**: They buy Apollo, Outreach, and ZoomInfo seats.
3.  **The Markup**: They charge you a premium on top of everything.

## Infrastructure Arbitrage

**MissionControl** is built on a different philosophy: **Infrastructure Arbitrage**.

We believe you should pay the *market rate* for intelligence and connectivity, not an arbitrary agency fee.

### The Cost Breakdown

| Component | Agency Cost | MissionControl Cost |
| :--- | :--- | :--- |
| **Enrichment** | Bundled ($?) | $0.05 / lead (Apollo direct) |
| **Voice Minutes** | Bundled ($?) | $0.12 / min (Retell direct) |
| **Management** | $5,000/mo Retainer | $499/mo Platform Fee |

## Saving $50k/Year

By switching to an infrastructure-first model, a typical Series A company saves over **$50,000 annually** while increasing lead volume by 10x.

[Check our ROI Calculator](/pricing) to see your specific savings.
        `
    },
    {
        slug: "rise-of-sales-supervisor",
        title: "The Rise of the Sales Supervisor: Why Manual Dialing is Obsolete",
        description: "The SDR role isn't dying; it's evolving. Meet the 'Agent Supervisor' who manages pods of AI talent.",
        date: "Feb 10, 2026",
        readTime: "4 min read",
        category: "Agentic Strategy",
        author: {
            name: "David Ross",
            role: "Head of Agentic Design",
            avatar: "/assets/avatars/david.jpg"
        },
        content: `
# From Dialing to Conducting

In 2024, a good SDR made 80 calls a day.
In 2026, a good **Sales Supervisor** manages 10 AI Agents who make 8,000 calls a day.

The job has shifted from *execution* to *strategy*.

## The Supervisor Workflow

1.  **Upload Context**: You feed the beast. Upload your PRD, slide decks, and competitor analysis.
2.  **Refine Strategy**: Use our **Campaign Wizard** to tweak the "Commander's Intent."
    *   *Prompt*: "Be aggressive on the pain point of 'Compliance Audit', but soft on pricing."
3.  **Monitor & Coach**: You don't listen to every call. You review the **Post-Call Mining** dashboard.

## Mission Memory

Our agents learn. When an agent hears a new objection ("We only use on-premise solutions"), it flags it. You, the Supervisor, write a rebuttal snippet. Pushed to production, **all 10 agents** now know how to handle that objection instantly.

That represents a learning velocity humans cannot match.
        `
    },
    {
        slug: "winning-climatetech",
        title: "Winning ClimateTech: How ASOC Found 10 Qualified Leads in 47 Seconds",
        description: "A case study in 'Vertical Intelligence'—using news signals to time outreach perfectly.",
        date: "Feb 05, 2026",
        readTime: "7 min read",
        category: "Case Study",
        author: {
            name: "Elena G.",
            role: "Vertical Growth Lead",
            avatar: "/assets/avatars/elena.jpg"
        },
        content: `
# The Signal: Series B Funding

**Sector**: ClimateTech (Carbon Capture)
**Trigger**: A major competitor announced a $50M Series B raise.

In the old world, an SDR might see this news 2 days later on TechCrunch.

In **MissionControl**, our **Apollo.io Signal Monitor** picked it up in real-time.

## The Play

1.  **Ingest Signal**: "Company X raised $50M."
2.  **Graph Search**: Find VP of Operations at Company X and similar roles at their top 5 competitors (who are now under pressure to grow).
3.  **Auto-Draft**: "Saw X raised. Are you planning to scale your facility operations to match?"

## The Result

*   **Leads Found**: 14
*   **Time to Execute**: 47 seconds
*   **Qualified Meetings**: 3 (21% conversion)

This is **Vertical Intelligence**. It's not about spamming; it's about being the first to add value when the context changes.
        `
    }
];

export function getPostBySlug(slug: string) {
    return BLOG_POSTS.find(post => post.slug === slug);
}
