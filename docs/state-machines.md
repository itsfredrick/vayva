# State Machines

## PaymentIntent

`INITIATED → REDIRECTED → PENDING → PAID | FAILED | CANCELED`

## Order

`DRAFT → PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → DELIVERED`

Order enters `PAID` only when PaymentIntent is `PAID`.
