# API Documentation

## Authentication
- POST /auth/signup
- POST /auth/login
- GET /me

## Commerce (Admin)
- GET /admin/products
- POST /admin/products
- GET /admin/orders

## Storefront
- GET /store/:slug/products
- POST /store/:slug/cart
- POST /store/:slug/checkout

## Webhooks
- POST /webhooks/paystack
- POST /webhooks/whatsapp
