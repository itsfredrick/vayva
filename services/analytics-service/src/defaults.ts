export const DEFAULT_TEMPLATES = {
  PRIVACY: {
    title: "Privacy Policy",
    content: `
# Privacy Policy
*Effective Date: {{date}}*

At **{{merchant_name}}**, we value your privacy. This policy explains how we collect, use, and protect your data.

### 1. Data We Collect
- Contact details (Name, Phone, Email)
- Delivery Address
- Order History

### 2. How We Use Data
We use your data to process orders, provide support, and (if you agree) send marketing updates.

### 3. Your Rights (NDPR)
Under the Nigerian Data Protection Regulation (NDPR), you have the right to access, correct, or delete your data. You can request this via our Trust Center.
        `,
  },
  TERMS: {
    title: "Terms of Service",
    content: `
# Terms of Service
By using our store, you agree to these terms.

### 1. Account
You are responsible for the security of any account created on this store.

### 2. Payments
We support Pay on Delivery and Online Payments via Vayva. All transactions are in NGN.
        `,
  },
  REFUNDS: {
    title: "Refund Policy",
    content: `
# Refund & Return Policy
We strive for 100% satisfaction.

### 1. Eligible Returns
Items must be unused and in original packaging. Returns must be requested within 48 hours of delivery.

### 2. Refund Process
Once verified, refunds are processed within 3-5 business days to your original payment method.
        `,
  },
};
