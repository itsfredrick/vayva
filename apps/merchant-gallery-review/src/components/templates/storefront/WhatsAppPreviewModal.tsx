"use client";

import React, { useState, useEffect } from "react";
import { Icon, Button, cn } from "@vayva/ui";

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  message?: string;
}

export function WhatsAppPreviewModal({
  isOpen,
  onClose,
  productName,
  message: initialMessage,
}: WhatsAppPreviewModalProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen && initialMessage) {
      setMessage(initialMessage);
    } else if (isOpen && productName) {
      setMessage(`Hello, I'd like to order ${productName}`);
    }
  }, [isOpen, productName, initialMessage]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] bg-[#E5DDD5] rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col h-[700px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage:
            'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Header */}
        <div className="bg-[#008069] text-white p-3 px-4 flex items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="hover:bg-white/10 rounded-full p-1 -ml-1"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <Icon name="User" className="text-gray-500" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base leading-tight">My Store</h3>
            <p className="text-[11px] opacity-80">Online</p>
          </div>
          <div className="flex gap-4 pr-1">
            <Icon name="Video" size={20} />
            <Icon name="Phone" size={20} />
            <Icon name="EllipsisVertical" size={20} />
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-center">
            <span className="bg-[#E1F3FB] text-[#1D1E20] text-[10px] px-2 py-1 rounded-lg shadow-sm border border-black/5 font-medium uppercase">
              Today
            </span>
          </div>

          <div className="bg-[#DCF8C6] p-2 px-3 rounded-lg rounded-tr-none shadow-sm max-w-[80%] self-end ml-auto relative group animate-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
              {message}
            </p>
            <div className="flex justify-end items-center gap-1 mt-1 opacity-60">
              <span className="text-[10px]">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <Icon name="Check" size={12} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white p-2 px-3 flex items-center gap-2 shrink-0 pb-6 md:pb-2">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Icon name="Plus" size={24} />
          </Button>
          <div className="flex-1 bg-white border border-gray-100 rounded-full px-4 py-2 text-sm text-gray-500 cursor-not-allowed">
            Message
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Icon name="Camera" size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Icon name="Mic" size={24} />
          </Button>
        </div>

        {/* Simulator Badge */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium z-10 pointer-events-none">
          WhatsApp Simulator
        </div>
      </div>
    </div>
  );
}
