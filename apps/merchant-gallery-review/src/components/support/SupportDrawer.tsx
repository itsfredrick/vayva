"use client";

import React, { useState } from "react";
import { Drawer, Button, Icon } from "@vayva/ui";
// import { SelfResolutionFlow } from './SelfResolutionFlow';
// import { TicketList } from './TicketList';
// import { TicketForm } from './TicketForm';

interface SupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: {
    type?: string;
    orderId?: string;
    paymentId?: string;
  };
}

type SupportView =
  | "home"
  | "self_resolution"
  | "ticket_form"
  | "ticket_list"
  | "ticket_detail";

export const SupportDrawer = ({
  isOpen,
  onClose,
  initialContext,
}: SupportDrawerProps) => {
  const [view, setView] = useState<SupportView>("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setView("self_resolution");
  };

  const renderContent = () => {
    switch (view) {
      case "home":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">How can we help?</h3>
              <div className="grid grid-cols-2 gap-2">
                <CategoryButton
                  icon="CreditCard"
                  label="Payments"
                  onClick={() => handleCategorySelect("payment")}
                />
                <CategoryButton
                  icon="Package"
                  label="Orders"
                  onClick={() => handleCategorySelect("order")}
                />
                <CategoryButton
                  icon="Wallet"
                  label="Wallet"
                  onClick={() => handleCategorySelect("wallet")}
                />
                <CategoryButton
                  icon="UserCheck"
                  label="KYC"
                  onClick={() => handleCategorySelect("kyc")}
                />
                <CategoryButton
                  icon="Globe"
                  label="Domain"
                  onClick={() => handleCategorySelect("domain")}
                />
                <CategoryButton
                  icon="MoreHorizontal"
                  label="Other"
                  onClick={() => handleCategorySelect("other")}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setView("ticket_list")}
              >
                <span>My Tickets</span>
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        );
      case "self_resolution":
        return (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("home")}
              className="mb-4"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" /> Back
            </Button>
            <div className="p-4 text-center">
              <p className="text-gray-500">
                Self Resolution Flow Placeholder for {selectedCategory}
              </p>
              <Button className="mt-4" onClick={() => setView("ticket_form")}>
                Contact Support
              </Button>
            </div>
          </div>
        );
      case "ticket_form":
        return (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("self_resolution")}
              className="mb-4"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" /> Back
            </Button>
            <p>Ticket Form Placeholder</p>
          </div>
        );
      case "ticket_list":
        return (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("home")}
              className="mb-4"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" /> Back
            </Button>
            <p>Ticket List Placeholder</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Support">
      <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
    </Drawer>
  );
};

const CategoryButton = ({
  icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-900 transition-colors"
  >
    <Icon name={icon} size={24} className="mb-2 text-gray-700" />
    <span className="text-xs font-medium text-gray-900">{label}</span>
  </button>
);
