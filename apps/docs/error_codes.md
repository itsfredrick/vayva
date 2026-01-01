# Error Codes

Standardized error codes for Vayva applications. These codes should be used in API responses and handled by the UI to show localized, user-friendly messages.

## Format

`category.code` (e.g., `auth.unauthorized`, `order.insufficient_stock`)

## Auth Errors

| Code                     | Message                                             | Action             |
| :----------------------- | :-------------------------------------------------- | :----------------- |
| \`auth.unauthorized\`    | You must be logged in to perform this action.       | Redirect to Login  |
| \`auth.forbidden\`       | You do not have permission to access this resource. | Show 403 Forbidden |
| \`auth.session_expired\` | Your session has expired. Please log in again.      | Redirect to Login  |

## Commerce Errors

| Code                         | Message                               | Action                  |
| :--------------------------- | :------------------------------------ | :---------------------- |
| \`order.insufficient_stock\` | One or more items are out of stock.   | Prompt to update cart   |
| \`order.payment_failed\`     | Payment could not be processed.       | Prompt to retry payment |
| \`product.not_found\`        | The requested product does not exist. | Show 404                |

## System Errors

| Code                      | Message                                    | Action                          |
| :------------------------ | :----------------------------------------- | :------------------------------ |
| \`system.internal_error\` | An unexpected error occurred.              | standardized generic error page |
| \`system.maintenance\`    | System is under maintenance.               | Show maintenance page           |
| \`system.rate_limit\`     | Too many requests. Please try again later. | Show retry-after time           |

## Implementation

All API error responses must follow this structure:

```json
{
  "error": {
    "code": "auth.unauthorized",
    "message": "User not authenticated",
    "details": {}
  }
}
```
