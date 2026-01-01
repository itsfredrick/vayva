# Data Classification & Privacy Map

This document defines the PII (Personally Identifiable Information) landscape for Vayva and the policies for handling it.

## 1. PII Inventory

| Table            | Field             | Classification     | Handling           | Retention            |
| ---------------- | ----------------- | ------------------ | ------------------ | -------------------- |
| `Order`          | `customerName`    | Confidential (PII) | Anonymize on DSR   | 7 Years (Finance)    |
| `Order`          | `customerPhone`   | Confidential (PII) | Redact/Hash on DSR | 7 Years (Finance)    |
| `Order`          | `shippingAddress` | Confidential (PII) | Redact on DSR      | 7 Years (Finance)    |
| `Customer`       | `name`            | Confidential (PII) | Anonymize on DSR   | Indefinite until DSR |
| `Customer`       | `email`           | Confidential (PII) | Delete on DSR      | Indefinite until DSR |
| `Customer`       | `phone`           | Confidential (PII) | Hash on DSR        | Indefinite until DSR |
| `SupportTicket`  | `description`     | Sensitive          | Redact if reported | 1 Year or DSR        |
| `SupportMessage` | `message`         | Sensitive          | Redact if reported | 1 Year or DSR        |
| `WebhookEvent`   | `payload`         | System             | Auto-purge         | 30 Days              |
| `AuditLog`       | `metadata`        | System             | Minimize PII       | 1 Year               |

## 2. DSR (Data Subject Request) Policies

### Right to Access (Export)

- **Scope**: All data linked to the provided User Identifier (Phone/Email).
- **Format**: JSON (machine readable).
- **Delivery**: Secure temporary link.

### Right to be Forgotten (Delete)

- **Financial Records**: DO NOT DELETE. Anonymize fields to "Redacted User" or similar.
- **Communications**: Redact message bodies.
- **Marketing**: Hard delete from lists.
- **Identity**: Hash phone numbers to maintain uniqueness constraints if necessary, or nullify.

## 3. Retention Policies

| Data Type           | Retention Period | Action                       |
| ------------------- | ---------------- | ---------------------------- |
| Webhook Payloads    | 30 Days          | Hard Delete (Keep Metadata)  |
| Job Logs (DLQ)      | 30 Days          | Hard Delete                  |
| Support Attachments | 180 Days         | Hard Delete                  |
| Chat Message Bodies | 180 Days         | Soft Delete (Redact content) |
