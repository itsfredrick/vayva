# 🚀 Vayva AI & API Setup Guide

## 📋 What You Need to Complete

### ✅ Already Configured:

- ✅ Paystack (Test & Live keys)
- ✅ Resend Email Service
- ✅ NextAuth Secret
- ✅ Database & Redis

### 🔑 Still Needed:

## 1. **Groq AI API Key** (FREE - Required for AI Assistant)

**Steps to get your FREE Groq API key:**

1. Visit: https://console.groq.com/keys
2. Sign up with your Google/GitHub account (no credit card needed)
3. Click "Create API Key"
4. Copy the key (starts with `gsk_...`)
5. Add to `.env` file:
   ```bash
   GROQ_API_KEY="gsk_your_actual_key_here"
   ```

**Why Groq?**

- ✅ 100% FREE (14,400 requests/day)
- ✅ Fastest AI inference (faster than OpenAI)
- ✅ Llama 3.1 70B model (very capable)
- ✅ No credit card required

---

## 2. **WhatsApp Business API** (Optional - Can skip for now)

**Steps to get WhatsApp credentials:**

1. Visit: https://developers.facebook.com/apps/
2. Create a new app → Select "Business" type
3. Add "WhatsApp" product
4. Go to WhatsApp → Getting Started
5. Copy these values to `.env`:
   ```bash
   WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
   WHATSAPP_ACCESS_TOKEN="your_access_token"
   WHATSAPP_BUSINESS_ACCOUNT_ID="your_business_account_id"
   ```

**Note:** You can leave WhatsApp disabled for now by keeping:

```bash
ENABLE_WHATSAPP="false"
```

---

## 3. **Production Deployment** (When ready)

For production, you'll need to:

1. **Generate secure NextAuth secret:**

   ```bash
   openssl rand -base64 32
   ```

   Replace `NEXTAUTH_SECRET` in `.env`

2. **Update URLs:**

   ```bash
   NEXTAUTH_URL="https://yourdomain.com"
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   NEXT_PUBLIC_API_URL="https://yourdomain.com/api"
   ```

3. **Switch to live payment mode:**
   ```bash
   PAYMENT_MODE="live"
   NODE_ENV="production"
   ```

---

## 🤖 How the AI Works

The AI assistant I've built for you:

### **Capabilities:**

1. **Customer Service**
   - Answers product questions
   - Provides order status updates
   - Handles complaints professionally

2. **Order Processing**
   - Helps customers place orders via WhatsApp
   - Collects delivery details (name, address, phone)
   - Confirms payment method preferences
   - Generates order confirmations

3. **Intent Detection**
   - Automatically detects what customer wants:
     - Order inquiry
     - Product question
     - Complaint
     - New order placement
   - Suggests relevant actions

4. **Nigerian Context**
   - Uses Nigerian English
   - Prices in Naira (₦)
   - Understands local payment methods (bank transfer, cash on delivery)

### **Training:**

The AI is pre-trained with:

- Your store name and products
- Nigerian e-commerce best practices
- Professional customer service guidelines
- Order collection workflows

### **Usage Example:**

```typescript
import { AIService } from "@/lib/ai/aiService";

// Customer asks: "How much is the iPhone 13?"
const response = await AIService.chat(
  [{ role: "user", content: "How much is the iPhone 13?" }],
  {
    storeName: "TechHub Nigeria",
    products: [{ name: "iPhone 13", price: 450000, available: true }],
    customerName: "Chioma",
  },
);

// AI responds with price and availability
console.log(response.message);
// "Hi Chioma! The iPhone 13 is ₦450,000 and it's currently in stock. Would you like to place an order?"
```

---

## 🎯 Next Steps

### **Immediate (Required):**

1. Get Groq API key → Add to `.env`
2. Test the AI assistant

### **Soon (Recommended):**

1. Set up WhatsApp Business API
2. Connect WhatsApp to AI assistant
3. Test full conversation flow

### **Before Production:**

1. Generate secure NextAuth secret
2. Update all URLs to production domain
3. Switch to live Paystack keys
4. Test payment flow end-to-end

---

## 🧪 Testing the AI

Once you add the Groq API key, test it:

```bash
# Start the dev server
pnpm dev

# The AI will be available at:
# POST /api/ai/chat
```

**Test conversation:**

```json
{
  "messages": [{ "role": "user", "content": "I want to buy a laptop" }],
  "context": {
    "storeName": "Your Store",
    "customerName": "Test Customer"
  }
}
```

---

## 💡 Tips

1. **Free Tier Limits:**
   - Groq: 14,400 requests/day (plenty for most stores)
   - Resend: 100 emails/day on free tier
   - Paystack test mode: unlimited

2. **Cost Optimization:**
   - AI responses are cached for 5 minutes
   - Only common questions hit the AI
   - Product catalog is updated hourly

3. **Monitoring:**
   - Check AI usage in Groq dashboard
   - Monitor email delivery in Resend dashboard
   - Track payments in Paystack dashboard

---

## 📞 Need Help?

If you encounter any issues:

1. Check `.env` file has all required keys
2. Restart dev server after adding new keys
3. Check console for error messages
4. Verify API keys are valid (not expired)

---

**Created by:** AI Assistant
**Last Updated:** December 25, 2024
