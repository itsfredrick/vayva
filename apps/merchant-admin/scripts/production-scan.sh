#!/bin/bash

# PRODUCTION READINESS SCAN V2
# Scans ONLY merchant-admin (PRIMARY SHIP TARGET)
# Exit code 1 = FAIL (blocks deployment)
# Exit code 0 = PASS

set -e

echo "🔍 PRODUCTION READINESS SCAN V2"
echo "================================"
echo ""
echo "SHIP TARGET: apps/merchant-admin ONLY"
echo ""

FAILED=0

# Define PRIMARY ship target
SRC_DIR="apps/merchant-admin/src"

# Verify target exists
if [ ! -d "$SRC_DIR" ]; then
    echo "❌ ERROR: $SRC_DIR not found"
    exit 1
fi

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. CHECK FOR MOCK DATA IMPORTS
echo "📦 Checking for mock data imports..."
MOCK_IMPORTS=$(grep -r "from '@/lib/mockData'" "$SRC_DIR" --exclude-dir=__tests__ --exclude="*.test.ts" --exclude="*.test.tsx" --exclude="*.spec.ts" 2>/dev/null || true)
if [ -n "$MOCK_IMPORTS" ]; then
    echo -e "${RED}❌ FAIL: Mock data imports found${NC}"
    echo "$MOCK_IMPORTS"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No mock data imports${NC}"
fi
echo ""

# 2. CHECK FOR MOCK DATABASE IMPORTS
echo "🗄️  Checking for mock database imports..."
MOCK_DB=$(grep -r "from '@/lib/mock-db'" "$SRC_DIR" --exclude-dir=__tests__ --exclude="*.test.ts" --exclude="*.test.tsx" 2>/dev/null || true)
if [ -n "$MOCK_DB" ]; then
    echo -e "${RED}❌ FAIL: Mock database imports found${NC}"
    echo "$MOCK_DB"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No mock database imports${NC}"
fi
echo ""

# 3. CHECK FOR MOCK TOKENS
echo "🔑 Checking for mock tokens..."
MOCK_TOKENS=$(grep -r "mock_token" "$SRC_DIR" --exclude-dir=__tests__ --exclude="*.test.ts" --exclude="*.test.tsx" 2>/dev/null || true)
if [ -n "$MOCK_TOKENS" ]; then
    echo -e "${RED}❌ FAIL: Mock tokens found${NC}"
    echo "$MOCK_TOKENS"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No mock tokens${NC}"
fi
echo ""

# 4. CHECK FOR MOCK CHECKOUT URLs
echo "💳 Checking for mock checkout URLs..."
MOCK_CHECKOUT=$(grep -r "mock-checkout" "$SRC_DIR" --exclude-dir=__tests__ --exclude="*.test.ts" --exclude="*.test.tsx" 2>/dev/null || true)
if [ -n "$MOCK_CHECKOUT" ]; then
    echo -e "${RED}❌ FAIL: Mock checkout URLs found${NC}"
    echo "$MOCK_CHECKOUT"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No mock checkout URLs${NC}"
fi
echo ""

# 5. CHECK FOR DEMO/PLACEHOLDER PRODUCTS
echo "📦 Checking for demo/placeholder products..."
DEMO_PRODUCTS=$(grep -r "demoProducts\|placeholderProducts" "$SRC_DIR" --exclude-dir=__tests__ --exclude="*.test.ts" --exclude="*.test.tsx" 2>/dev/null || true)
if [ -n "$DEMO_PRODUCTS" ]; then
    echo -e "${RED}❌ FAIL: Demo/placeholder products found${NC}"
    echo "$DEMO_PRODUCTS"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No demo/placeholder products${NC}"
fi
echo ""

# 6. CHECK FOR CONSOLE.LOG IN API ROUTES (HARD FAIL)
echo "📝 Checking for console.log in API routes..."
CONSOLE_LOGS=$(grep -r "console\.log" "$SRC_DIR/app/api" --exclude-dir=__tests__ --exclude="*.test.ts" --exclude="*.spec.ts" 2>/dev/null || true)
if [ -n "$CONSOLE_LOGS" ]; then
    echo -e "${RED}❌ FAIL: console.log found in API routes${NC}"
    echo "$CONSOLE_LOGS"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No console.log in API routes${NC}"
fi
echo ""

# 7. CHECK FOR TODO IN API ROUTES (HARD FAIL - NO WARNINGS)
echo "📋 Checking for TODO comments in API routes..."
TODO_COMMENTS=$(grep -r "TODO" "$SRC_DIR/app/api" --exclude-dir=__tests__ --exclude="*.test.ts" --exclude="*.spec.ts" 2>/dev/null || true)
if [ -n "$TODO_COMMENTS" ]; then
    echo -e "${RED}❌ FAIL: TODO comments found in API routes${NC}"
    echo "$TODO_COMMENTS"
    echo ""
    echo -e "${RED}All TODOs must be resolved before production deployment${NC}"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No TODO comments in API routes${NC}"
fi
echo ""

# 8. CHECK FOR MOCK WHATSAPP PARSER
echo "💬 Checking for mock WhatsApp parser..."
MOCK_WA=$(grep -r "MockWhatsAppParser" "$SRC_DIR" --exclude-dir=__tests__ --exclude="*.test.ts" 2>/dev/null || true)
if [ -n "$MOCK_WA" ]; then
    echo -e "${RED}❌ FAIL: Mock WhatsApp parser found${NC}"
    echo "$MOCK_WA"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No mock WhatsApp parser${NC}"
fi
echo ""

# 9. CHECK FOR MOCK KYC RESULTS
echo "🆔 Checking for mock KYC results..."
MOCK_KYC=$(grep -r "Deterministic mock\|SandboxProvider" "$SRC_DIR/services" 2>/dev/null || true)
if [ -n "$MOCK_KYC" ]; then
    echo -e "${RED}❌ FAIL: Mock KYC results found${NC}"
    echo "$MOCK_KYC"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No mock KYC results${NC}"
fi
echo ""

# 10. CHECK FOR MOCK STORE CONFIG
echo "🏪 Checking for mock store config..."
MOCK_STORE=$(grep -r "let mockStore:" "$SRC_DIR" --exclude-dir=__tests__ 2>/dev/null || true)
if [ -n "$MOCK_STORE" ]; then
    echo -e "${RED}❌ FAIL: Mock store config found${NC}"
    echo "$MOCK_STORE"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: No mock store config${NC}"
fi
echo ""

# 11. CHECK THAT MOCK FILES DON'T EXIST
echo "🗑️  Checking that mock files are deleted..."
if [ -f "$SRC_DIR/lib/mockData.ts" ]; then
    echo -e "${RED}❌ FAIL: mockData.ts still exists${NC}"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: mockData.ts deleted${NC}"
fi

if [ -f "$SRC_DIR/lib/mock-db.ts" ]; then
    echo -e "${RED}❌ FAIL: mock-db.ts still exists${NC}"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: mock-db.ts deleted${NC}"
fi

if [ -f "$SRC_DIR/services/MockWhatsAppParser.ts" ]; then
    echo -e "${RED}❌ FAIL: MockWhatsAppParser.ts still exists${NC}"
    FAILED=1
else
    echo -e "${GREEN}✅ PASS: MockWhatsAppParser.ts deleted${NC}"
fi
echo ""

# FINAL RESULT
echo "=============================="
if [ $FAILED -eq 1 ]; then
    echo -e "${RED}❌ PRODUCTION SCAN FAILED${NC}"
    echo ""
    echo "Production deployment BLOCKED."
    echo "Fix all issues above before deploying."
    exit 1
else
    echo -e "${GREEN}✅ PRODUCTION SCAN PASSED${NC}"
    echo ""
    echo "All checks passed. Safe to deploy."
    exit 0
fi
