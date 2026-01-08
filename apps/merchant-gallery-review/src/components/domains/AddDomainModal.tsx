"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@vayva/ui";

interface AddDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (domain: string) => Promise<void>;
  isAdding: boolean;
}

export const AddDomainModal = ({
  isOpen,
  onClose,
  onAdd,
  isAdding,
}: AddDomainModalProps) => {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      setError("Please enter a valid domain (e.g., mystore.com)");
      return;
    }

    try {
      await onAdd(domain);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add domain");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 relative p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Icon name="X" size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Connect Domain
        </h2>
        <p className="text-gray-500 mb-6">
          Enter the domain you want to connect to your store.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="domain"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Domain Name
            </label>
            <input
              type="text"
              id="domain"
              placeholder="e.g. mystore.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors"
              value={domain}
              onChange={(e) => setDomain(e.target.value.toLowerCase())}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white"
              isLoading={isAdding}
            >
              Connect Domain
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
