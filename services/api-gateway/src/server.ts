import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./lib/config";
import authPlugin from "./plugins/auth";
import signupRoute from "./routes/auth/signup";
import loginRoute from "./routes/auth/login";
import forgotPasswordRoute from "./routes/auth/forgot-password";
import resetPasswordRoute from "./routes/auth/reset-password";
import onboardingRoute from "./routes/onboarding";

import proxy from "@fastify/http-proxy";

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: [
    config.services.MERCHANT_ADMIN,
    config.services.OPS_CONSOLE,
    config.services.STOREFRONT,
  ],
  credentials: true,
});
server.register(authPlugin);


server.get("/health", async () => {
  return { status: "ok" };
});

// Custom Handlers for Cookie-based Auth (Merchant)
server.post("/v1/auth/merchant/login", async (request, reply) => {
  const upstreamResponse = await fetch(
    `${config.services.AUTH}/v1/auth/merchant/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.body),
    },
  );

  const data = await upstreamResponse.json();
  if (upstreamResponse.status === 200 && data.token) {
    reply.setCookie("vayva_session", data.token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });
  }
  return reply.status(upstreamResponse.status).send(data);
});

// Custom Handlers for Cookie-based Auth (Ops)
server.post("/v1/auth/ops/verify-mfa", async (request, reply) => {
  const upstreamResponse = await fetch(
    `${config.services.AUTH}/v1/auth/ops/verify-mfa`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.body),
    },
  );

  const data = await upstreamResponse.json();
  if (upstreamResponse.status === 200 && data.token) {
    reply.setCookie("vayva_session", data.token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 12 * 60 * 60, // 12 hours for ops
    });
  }
  return reply.status(upstreamResponse.status).send(data);
});

// Proxy everything else to Auth Service
server.register(proxy, {
  upstream: config.services.AUTH,
  prefix: "/v1/auth",
  rewritePrefix: "/v1/auth",
  http2: false,
});

// Proxy to Staff Service (Lives in Auth Service)
server.register(proxy, {
  upstream: config.services.AUTH,
  prefix: "/v1/staff",
  rewritePrefix: "/v1/staff",
  http2: false,
});

// Proxy to Onboarding Service (Lives in Auth Service)
server.register(proxy, {
  upstream: config.services.AUTH,
  prefix: "/v1/onboarding",
  rewritePrefix: "/v1/onboarding",
  http2: false,
});

// Proxy to Orders Service
server.register(proxy, {
  upstream: config.services.ORDERS,
  prefix: "/v1/orders",
  rewritePrefix: "/v1/orders",
  http2: false,
});

// Proxy to Payments Service
server.register(proxy, {
  upstream: config.services.PAYMENTS,
  prefix: "/v1/payments",
  rewritePrefix: "/v1/payments",
  http2: false,
});

// Proxy to Audit Service
server.register(proxy, {
  upstream: config.services.CORE,
  prefix: "/v1/audit",
  rewritePrefix: "/v1/audit",
  http2: false,
});

// Proxy to WhatsApp Service
server.register(proxy, {
  upstream: config.services.WHATSAPP,
  prefix: "/v1/whatsapp",
  rewritePrefix: "/v1/whatsapp",
  http2: false,
});

// Proxy to AI Orchestrator
server.register(proxy, {
  upstream: config.services.AI,
  prefix: "/v1/ai",
  rewritePrefix: "/v1/ai",
  http2: false,
});

// Proxy to Approvals Service
server.register(proxy, {
  upstream: config.services.APPROVALS,
  prefix: "/v1/approvals",
  rewritePrefix: "/v1/approvals",
  http2: false,
});

// Proxy to Notifications Service
server.register(proxy, {
  upstream: config.services.NOTIFICATIONS,
  prefix: "/v1/notifications",
  rewritePrefix: "/v1/notifications",
  http2: false,
});

// Proxy to Products Service
// Catalog & Inventory (Routes to catalog-service)
server.register(proxy, {
  upstream: config.services.CORE,
  prefix: "/v1/products",
  rewritePrefix: "/api/products", // Keeping rewrite logic as is
  http2: false,
});

server.register(proxy, {
  upstream: config.services.CORE,
  prefix: "/v1/inventory",
  rewritePrefix: "/api/inventory",
  http2: false,
});

server.register(proxy, {
  upstream: config.services.CORE,
  prefix: "/v1/variants",
  rewritePrefix: "/api/variants",
  http2: false,
});

server.register(proxy, {
  upstream: config.services.SUPPORT, // Support Service
  prefix: "/v1/tickets",
  rewritePrefix: "/tickets", // internal route was /tickets
  http2: false,
});

server.register(proxy, {
  upstream: config.services.PAYMENTS,
  prefix: "/v1/public/pay",
  rewritePrefix: "/v1/payments/initialize",
  http2: false,
});

// Webhooks
server.post("/webhooks/paystack", async (request, reply) => {
  // Proxy to payments-service webhook handler
  const response = await fetch(`${config.services.PAYMENTS}/v1/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-paystack-signature": request.headers["x-paystack-signature"] as string,
    },
    body: JSON.stringify(request.body),
  });
  const data = await response.json();
  return reply.status(response.status).send(data);
});

server.get("/webhooks/whatsapp", async (request, reply) => {
  // Proxy verification to WhatsApp Service
  const query = new URLSearchParams(request.query as any).toString();
  const response = await fetch(
    `${config.services.WHATSAPP}/v1/whatsapp/webhooks/whatsapp?${query}`,
    {
      method: "GET",
    },
  );
  const data = await response.text(); // key is that it returns text/plain for hub.challenge
  return reply.status(response.status).send(data);
});

server.post("/webhooks/whatsapp", async (request, reply) => {
  // Proxy events to WhatsApp Service
  const response = await fetch(
    `${config.services.WHATSAPP}/v1/whatsapp/webhooks/whatsapp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward signature header if present (Meta uses x-hub-signature-256)
        "x-hub-signature-256":
          (request.headers["x-hub-signature-256"] as string) || "",
      },
      body: JSON.stringify(request.body),
    },
  );
  const data = await response.json();
  return reply.status(response.status).send(data);
});

const start = async () => {
  // Startup Validation for Production
  if (process.env.NODE_ENV === "production") {
    const services = Object.values(config.services);
    const LOCAL_INDICATOR = ["local", "host"].join("");
    const invalid = services.filter((s) => s.includes(LOCAL_INDICATOR));
    if (invalid.length > 0) {
      console.error(
        "FATAL: Production config contains loopback references:",
        invalid,
      );
      process.exit(1);
    }
  }


  try {
    await server.listen({
      port: parseInt(config.PORT) || 4000,
      host: "0.0.0.0",
    });
    console.log(`API Gateway running on port ${parseInt(config.PORT) || 4000}`);
    console.log(`Service Registry Loaded: ${Object.keys(config.services).length} services`);
  } catch (err) {
    (server.log as any).error(err);
    process.exit(1);
  }
};

start();
