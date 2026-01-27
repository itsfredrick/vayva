#!/bin/bash

files=(
"apps/marketing/src/components/marketing/marketing-footer.tsx"
"apps/marketplace/src/components/marketplace/PromoCarousel.tsx"
"apps/marketplace/src/app/(pages)/listing/[id]/page.tsx"
"apps/marketplace/src/app/(pages)/signin/page.tsx"
"apps/marketplace/src/app/(pages)/signup/page.tsx"
"apps/marketplace/src/app/(pages)/IndustriesInteractiveSection.tsx"
"apps/merchant-admin/src/components/control-center/ProductShowcaseEditor.tsx"
"apps/merchant-admin/src/components/onboarding/steps/WelcomeStep.tsx"
"apps/ops-console/src/app/ops/(app)/alerts/page.tsx"
"apps/ops-console/src/app/ops/(app)/marketplace/listings/page.tsx"
"apps/ops-console/src/app/ops/(app)/onboarding/page.tsx"
"apps/ops-console/src/app/ops/(app)/payments/page.tsx"
"apps/ops-console/src/app/ops/(app)/refunds/page.tsx"
"apps/ops-console/src/app/ops/(app)/risk/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    sed -i '' 's/<button>/<Button variant="ghost">/g; s/<button \([^>]*\)>/<Button variant="ghost" \1>/g; s/<\/button>/<\/Button>/g' "$file"
    echo "Processed $file"
  else
    echo "File not found: $file"
  fi
done
