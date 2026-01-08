import React, { useEffect, useState } from "react";
import { Icon, Button, cn } from "@vayva/ui";

interface NotificationBellProps {
  onClick: () => void;
  isOpen: boolean;
}

export const NotificationBell = ({
  onClick,
  isOpen,
}: NotificationBellProps) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Poll for unread count
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count");
        const data = await res.json();
        setUnreadCount(data.count);
      } catch (err) {
        console.error("Failed to fetch notification count", err);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "relative text-gray-500 hover:text-gray-900 transition-colors",
        isOpen && "bg-gray-100 text-gray-900",
      )}
      onClick={onClick}
    >
      <Icon name="Bell" size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-in zoom-in duration-300" />
      )}
    </Button>
  );
};
