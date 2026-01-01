# Page QA Matrix

| Page                  | Status   | Notes                                |
| --------------------- | -------- | ------------------------------------ |
| **Marketing**         |          |                                      |
| / (Landing)           | ✅ Clean | Monochrome theme applied             |
| /features             | ⚠️ Check | Ensure sub-pages match landing theme |
| /pricing              | ⚠️ Check |                                      |
| **Auth**              |          |                                      |
| /signin               | ✅ Clean | Google button polished               |
| /signup               | ✅ Clean | Google button polished               |
| /verify               | Pending  | Checking redirect logic              |
| **Onboarding**        |          |                                      |
| /onboarding           | Pending  |                                      |
| /onboarding/resume    | Pending  |                                      |
| **Dashboard**         |          |                                      |
| /admin/dashboard      | ✅ Clean | Shell & Overview checked             |
| /admin/orders         | ✅ Clean |                                      |
| /admin/products       | ✅ Clean |                                      |
| /admin/customers      | ✅ Clean |                                      |
| /admin/wallet         | ⚠️ Check | Confirm KYC gating                   |
| /admin/wa-agent       | ✅ Clean |                                      |
| /admin/control-center | ✅ Clean |                                      |
| **Satellites**        |          |                                      |
| Storefront (3001)     | ✅ Clean | Basic structure in place             |
| Marketplace (3002)    | ✅ Clean | Waitlist logic verified              |
| Ops Console (3003)    | ✅ Clean | Admin shell consistent               |

## Notes

- **Marketing**: Landing page refactored to remove neon green.
- **Auth**: Google button style updated.
- **Onboarding**: Redirect logic confirmed.
- **Dashboard**: Sidebar links map correctly (Finance -> Wallet).
- **Satellites**: All apps implement basic shells and health checks.
