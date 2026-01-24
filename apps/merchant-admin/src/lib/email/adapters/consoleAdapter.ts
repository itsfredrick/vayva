export class ConsoleAdapter {
    async send(payload: any) {
        console.log(`
        [ConsoleEmailAdapter] Sending Email
        ------------------------------------------
        To: ${payload.to}
        Subject: ${payload.subject}
        Template: ${payload.templateKey}
        Meta: ${JSON.stringify(payload.meta, null, 2)}
        Text: ${payload.text}
        ------------------------------------------
        `);
        return { success: true, providerId: `console-${Date.now()}` };
    }
}
