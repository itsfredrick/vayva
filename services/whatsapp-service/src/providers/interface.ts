export interface SendMessageOptions {
  recipient: string;
  type: "text" | "image" | "template";
  body?: string;
  mediaUrl?: string;
  templateName?: string;
  language?: string;
  components?: any[];
}

export interface WhatsAppProvider {
  sendMessage(
    options: SendMessageOptions,
  ): Promise<{ providerMessageId: string }>;
  syncTemplates(): Promise<void>;
}
