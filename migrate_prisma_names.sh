#!/bin/bash

# Define the pairs of snake_case to camelCase in a simple list
# Extracted from schema.prisma @@map attributes
models="analytics_event:analyticsEvent
api_error:apiError
api_key:legacyApiKey
approval_execution_log:approvalExecutionLog
approval_request:approval
audit_log:auditLog
backup_receipt:backupReceipt
checkout_recovery_message:checkoutRecoveryMessage
checkout_recovery_settings:checkoutRecoverySettings
checkout_session:checkoutSession
communication_consent:communicationConsent
compliance_event:complianceEvent
conversation_tag:conversationTag
conversation_tag_map:conversationTagMap
dispute:dispute
dispute_evidence:disputeEvidence
dispute_submission:disputeSubmission
domain_mapping:domainMapping
dunning_attempt:dunningAttempt
email_message:emailMessage
email_suppression:emailSuppression
feature_flag:featureFlag
fraud_signal:fraudSignal
idempotency_key:idempotencyKey
import_job:importJob
incident_link:incidentLink
integration_event:integrationEvent
internal_note:internalNote
inventory_item:inventoryItem
invoice:invoice
job_dead_letter:jobDeadLetter
merchant_account_lifecycle:merchantAccountLifecycle
merchant_security_settings:merchantSecuritySettings
merchant_subscription:merchantSubscription
notification:notification
notification_log:notificationLog
notification_preference:notificationPreference
onboarding_analytics_events:onboardingAnalyticsEvent
partner:partner
partner_payout_ledger:partnerPayoutLedger
partner_referral_code:partnerReferralCode
password_reset_token:passwordResetToken
publish_history:publishHistory
quick_reply:quickReply
referral_attribution:referralAttribution
restore_drill_run:restoreDrillRun
return_event:returnEvent
return_request:returnRequest
risk_profile:riskProfile
status_incident:statusIncident
status_incident_update:statusIncidentUpdate
status_incident_v2:statusIncidentV2
stock_movement:stockMovement
stock_reservation:stockReservation
store_template_selection:storeTemplateSelection
storefront_draft:storefrontDraft
storefront_published:storefrontPublished
support_ticket:supportTicket
support_ticket_feedback:supportTicketFeedback
template_manifest:templateManifest
ticket_message:ticketMessage
uptime_check:uptimeCheck
uptime_check_result:uptimeCheckResult
user_email_verification:userEmailVerification
user_session:userSession
webhook_delivery:webhookDelivery
webhook_event:webhookEvent
webhook_subscription:webhookSubscription"

# Search and replace in apps and services
for pair in $models; do
  snake=$(echo $pair | cut -d: -f1)
  camel=$(echo $pair | cut -d: -f2)
  echo "Replacing .$snake with .$camel..."
  
  # Replace with prisma., tx., and db. prefixes
  find apps services packages tests -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/.next/*" -exec sed -i '' -e "s/prisma\.$snake/prisma\.$camel/g" -e "s/tx\.$snake/tx\.$camel/g" -e "s/db\.$snake/db\.$camel/g" {} +
done

echo "Done."
