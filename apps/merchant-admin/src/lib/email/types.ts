
export interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    text?: string;
    templateKey: string;
    merchantId?: string;
    userId?: string;
    correlationId: string;
    meta?: any;
}


export interface EmailResult {
    success: boolean;
    providerId?: string;
    error?: string;
}

export interface EmailAdapter {
    send(payload: EmailPayload): Promise<EmailResult>;
}

