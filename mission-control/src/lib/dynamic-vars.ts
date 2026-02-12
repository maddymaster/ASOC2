export const DYNAMIC_VARS = {
    templates: {
        greeting: "Hi {{first_name}}, this is Alex from Mission Control.",
        context: "I saw that {{company_name}} is growing in the {{industry}} space.",
        validation: "Since you selected the {{selected_slot}} slot, I wanted to confirm if that still works for you?"
    }
};

export function interpolateScript(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || `[${key}]`);
}
