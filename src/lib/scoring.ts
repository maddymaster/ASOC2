export function calculateLeadScore(lead: any): number {
    let score = 50; // Base score

    if (lead.title?.match(/CEO|Founder|VP|Director|Head/i)) score += 20;
    if (lead.employees === '51,200' || lead.employees === '201,500') score += 15;
    if (lead.location?.match(/San Francisco|New York|London|Remote/i)) score += 10;

    return Math.min(score, 100);
}
