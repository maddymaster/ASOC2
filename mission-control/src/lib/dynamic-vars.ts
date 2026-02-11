export const DYNAMIC_VARS = {
    templates: {
        greeting: "Hi {{first_name}}, this is Alex. I was looking at {{company_name}}’s recent growth in {{industry}}...",
        context: "I saw you recently posted a job for {{job_title}}. Our tool helps teams like yours with...",
        validation: "Just to confirm, does {{selected_slot}} still work for you?"
    },
    systemPromptAddon: `
    DYNAMIC VARIABLE INSTRUCTIONS:
    You have access to the prospect's data. Integrate it naturally into your speech:
    - Name: {{first_name}}
    - Company: {{company_name}}
    - Industry: {{industry}}
    - Job Title: {{job_title}}
    
    GUIDELINES:
    - Greeting: "Hi {{first_name}}, this is Alex. I was looking at {{company_name}}’s recent growth..."
    - Context: "I saw you posted a job for {{job_title}}..."
    - Validation: Confirm times using {{selected_slot}}.
  `
};

export function interpolateScript(template: string, data: Record<string, string>) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || `[${key}]`);
}
