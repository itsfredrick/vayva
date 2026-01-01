#!/bin/bash

echo "🧪 Testing Vayva AI Assistant..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if server is running
echo "1️⃣ Checking if server is running..."
if curl -s http://localhost:3000/api/ai/chat > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server is running${NC}"
else
    echo -e "${RED}✗ Server is not running${NC}"
    echo -e "${YELLOW}Please run: pnpm dev${NC}"
    exit 1
fi

echo ""
echo "2️⃣ Checking AI configuration..."
HEALTH=$(curl -s http://localhost:3000/api/ai/chat)
echo "$HEALTH" | jq '.'

STATUS=$(echo "$HEALTH" | jq -r '.status')
if [ "$STATUS" = "ready" ]; then
    echo -e "${GREEN}✓ AI is configured and ready!${NC}"
else
    echo -e "${RED}✗ AI is not ready${NC}"
    echo -e "${YELLOW}Try restarting the dev server: pnpm dev${NC}"
    exit 1
fi

echo ""
echo "3️⃣ Testing AI chat..."
echo "Example: curl -X POST -H 'Content-Type: application/json' -d '{\"message\": \"hi\"}' https://api.vayva.ng/v1/ai/chat"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello! How much is the iPhone 13?"}
    ],
    "context": {
      "storeName": "TechHub Nigeria",
      "products": [
        {"name": "iPhone 13", "price": 450000, "available": true},
        {"name": "Samsung Galaxy S23", "price": 380000, "available": true}
      ],
      "customerName": "Chioma"
    }
  }')

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ AI responded successfully!${NC}"
    echo ""
    echo "AI Response:"
    echo "$RESPONSE" | jq -r '.data.message'
    echo ""
    echo "Detected Intent: $(echo "$RESPONSE" | jq -r '.data.intent')"
    echo "Confidence: $(echo "$RESPONSE" | jq -r '.data.confidence')"
else
    echo -e "${RED}✗ AI test failed${NC}"
    echo "$RESPONSE" | jq '.'
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All tests passed! Your AI is working perfectly!${NC}"
