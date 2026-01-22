export interface SendMessageOptions {
  recipient: string;
  type: "text" | "image" | "template";
  body?: string;
  mediaUrl?: string;
  templateName?: string;
  language?: string;
  components?: unknown[];
}

export interface WhatsAppProvider {
  sendMessage(
    options: SendMessageOptions,
  ): Promise<{ providerMessageId: string }>;
  syncTemplates(): Promise<void>;
}
