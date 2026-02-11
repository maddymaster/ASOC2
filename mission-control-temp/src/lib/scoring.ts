export interface LeadCandidate {
    title: string;
    company: string;
    employees: string;
}

export function calculateLeadScore(lead: LeadCandidate): number {
    // Simple heuristic scoring
    let score = 50; // Base score

    // Title Fit
    const targetTitles = ['CTO', 'VP', 'Head', 'Director', 'Founder'];
    if (targetTitles.some(t => lead.title.includes(t))) {
        score += 20;
    }

    // Company Size Fit (Randomized for mock data)
    score += Math.floor(Math.random() * 20);

    // Cap at 100
    return Math.min(score, 100);
}
