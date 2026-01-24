"use client";

import React from "react";
import { Button } from "@vayva/ui";
// Adjust naming if needed, or remove logic if broken
import { TEMPLATES } from "@/lib/templates";

// Local Mocks
const Dialog = ({ children, open, onOpenChange }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => onOpenChange(false)}>
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
const DialogContent = ({ children }: any) => <div className="h-full flex flex-col">{children}</div>;
const DialogHeader = ({ children }: any) => <div className="p-4 border-b flex justify-between items-center">{children}</div>;
const DialogTitle = ({ children }: any) => <h2 className="text-xl font-bold">{children}</h2>;

export function TemplatePreviewModal({ open, onOpenChange, templateId }: any) {
  const template = (TEMPLATES as any)[templateId];

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview: {template.name}</DialogTitle>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogHeader>
        <div className="flex-1 w-full h-[600px] bg-gray-50 p-8 overflow-y-auto">
          {/* Placeholder for iframe or preview component */}
          <div className="flex items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            Preview for {template.name} ({template.slug})
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
