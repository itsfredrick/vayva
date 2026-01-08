import React from "react";

// Registry of all Vayva Standard Templates
// This file maps string IDs to their React Component implementations.

import { SimpleRetailTemplate } from "./retail/SimpleRetail";
import { PerfumeLuxuryTemplate } from "./retail/PerfumeLuxury";
import { AutoPartsTemplate } from "./retail/AutoParts";
import { FoodCateringTemplate } from "./food/FoodCatering";
import { StreetFoodTemplate } from "./food/StreetFood";
import { FreshProduceTemplate } from "./food/FreshProduce";
import { SoloProfessionalTemplate } from "./services/SoloProfessional";
import { HomeServicesTemplate } from "./services/HomeServices";
import { DigitalProductTemplate } from "./services/DigitalProduct";
import { WholesaleB2BTemplate } from "./services/WholesaleB2B";
import { PhoneGadgetTemplate } from "./retail/PhoneGadget";
import { CosmeticsBeautyTemplate } from "./retail/CosmeticsBeauty";
import { FurnitureHomeTemplate } from "./retail/FurnitureHome";
import { FashionDesignerTemplate } from "./services/FashionDesigner";
import { EventPlanningTemplate } from "./services/EventPlanning";
import { LogisticsServiceTemplate } from "./services/LogisticsService";
import { PharmacyHealthTemplate } from "./services/PharmacyHealth";
import { RealEstateTemplate } from "./services/RealEstate";
import { TrainingSchoolTemplate } from "./services/TrainingSchool";
import { CommunityCoopTemplate } from "./services/CommunityCoop";

export interface TemplateProps {
  businessName: string;
  demoMode?: boolean;
}

export const TEMPLATE_REGISTRY: Record<
  string,
  React.ComponentType<TemplateProps>
> = {
  "simple-retail": SimpleRetailTemplate,
  "perfume-luxury": PerfumeLuxuryTemplate,
  "auto-parts": AutoPartsTemplate,
  "food-catering": FoodCateringTemplate,
  "street-food": StreetFoodTemplate,
  "fresh-produce": FreshProduceTemplate,
  "solo-pro": SoloProfessionalTemplate,
  "home-services": HomeServicesTemplate,
  "digital-product": DigitalProductTemplate,
  "wholesale-b2b": WholesaleB2BTemplate,
  "phone-gadgets": PhoneGadgetTemplate,
  "cosmetics-beauty": CosmeticsBeautyTemplate,
  "furniture-home": FurnitureHomeTemplate,
  "fashion-designer": FashionDesignerTemplate,
  "event-planning": EventPlanningTemplate,
  "logistics-service": LogisticsServiceTemplate,
  "pharmacy-health": PharmacyHealthTemplate,
  "real-estate": RealEstateTemplate,
  "training-school": TrainingSchoolTemplate,
  "community-coop": CommunityCoopTemplate,
};

export const getTemplateComponent = (templateId: string) => {
  return TEMPLATE_REGISTRY[templateId] || null;
};
