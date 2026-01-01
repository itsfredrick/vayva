import { LegalDocument } from "../types";

export const prohibitedItems: LegalDocument = {
  slug: "prohibited-items",
  title: "Prohibited Items Policy",
  lastUpdated: "December 17, 2025",
  summary: "A list of items that are not allowed to be sold on Vayva.",
  sections: [
    {
      heading: "1. Introduction",
      content: [
        "Vayva maintains a list of prohibited items to ensure the safety of our community and compliance with Nigerian laws. Merchants found listing these items will have their products removed and accounts suspended.",
      ],
    },
    {
      heading: "2. Regulated and Illegal Goods",
      content: [
        "The following items are strictly prohibited:",
        "• Illegal drugs, narcotics, and drug paraphernalia.",
        "• Weapons, firearms, ammunition, and explosives.",
        "• Stolen property or counterfeit goods.",
        "• Hazardous materials (radioactive, toxic, etc.).",
        "• Human remains or body parts.",
        "• Adult content or services.",
      ],
    },
    {
      heading: "3. Restricted Categories",
      content: [
        "Some items require specific licenses or pre-approval:",
        "• Alcohol and heavy machinery.",
        "• Prescription medications (requires Pharmacy license verification).",
        "• Financial services or securities.",
      ],
    },
    {
      heading: "4. Enforcement and Reporting",
      content: [
        "We use automated tools and manual review to detect prohibited items. If you see a violation, please report it to safety@vayva.shop. Vayva cooperates with Nigerian law enforcement agencies in cases of illegal trade.",
      ],
      type: "callout-nigeria",
    },
  ],
};
