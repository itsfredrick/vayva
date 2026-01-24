"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button, Icon, IconName, cn } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { NotificationBell } from "./notifications/NotificationBell";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { GlobalBanner } from "./notifications/GlobalBanner";
import { Logo } from "./Logo";
import { SupportChat } from "./support/support-chat";
import { CommandPalette } from "./ai/CommandPalette";
import { extensionRegistry } from "@/lib/extensions/registry";

import { getSidebar, SIDEBAR_GROUPS } from "@/config/sidebar";
import { IndustrySlug, SidebarGroup } from "@/lib/templates/types";

// ... (other imports)

const ACCOUNT_DROPDOWN_ITEMS: { name: string; href: string; icon: IconName }[] = [
  { name: "Account", href: "/dashboard/settings/profile", icon: "User" },
  { name: "Settings", href: "/dashboard/settings/store", icon: "Settings" },
  { name: "Billing", href: "/dashboard/settings/billing", icon: "CreditCard" },
];

export interface AdminShellProps {
  children: React.ReactNode;
  _title?: string;
  _breadcrumb?: { label: string; href?: string }[];
  mode?: "admin" | "onboarding";
}

export const AdminShell = ({
  children,
  _title,
  _breadcrumb,
  mode = "admin",
}: AdminShellProps): React.JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, merchant, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [industrySlug, setIndustrySlug] = useState<IndustrySlug | null>(null);
  const [enabledExtensionIds, setEnabledExtensionIds] = useState<string[]>([]);
  const [_isLoadingIndustry, setIsLoadingIndustry] = useState(true);

  // Mobile State
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification UI State
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Initial logic for "FD" avatar
  // Cast to any as the session types might be generic
  const initials = user ? `${(user as any).firstName?.[0] || ""}${(user as any).lastName?.[0] || ""}` : "FD";

  // Fallback Merchant Details
  const merchantName =
    (merchant as any)?.firstName || (user as any)?.firstName || "Merchant";
  const _storeName = (merchant as any)?.businessName || "My Store";

  // Store URL logic
  const [storeLink, setStoreLink] = useState<string>("");
  const [storeStatus, setStoreStatus] = useState<"live" | "draft">("draft");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false); // Reset on resize to desktop
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch Store Info & Industry
    fetch("/api/auth/merchant/me")
      .then((res) => res.json())
      .then((data) => {
        const merchantData = data.merchant || {};

        if (merchantData.logoUrl) {
          setStoreLogo(merchantData.logoUrl);
        }

        const fetchedIndustry = merchantData.industrySlug as IndustrySlug;

        // Critical Redirect Logic
        // If no industry set, and we are NOT already on the settings page, redirect.
        // MIGRATION FIX: If industry is missing, force them to the new onboarding step
        // We added a whitelist for the target page to avoid loops
        if (!fetchedIndustry && !pathname.includes("/onboarding/industry")) {
          router.push("/onboarding/industry");
        } else {
          setIndustrySlug(fetchedIndustry);
        }

        if (merchantData.enabledExtensionIds) {
          setEnabledExtensionIds(merchantData.enabledExtensionIds);
        }

        if (merchantData.externalManifests) {
          merchantData.externalManifests.forEach((manifest: any) => {
            extensionRegistry.register(manifest);
          });
        }
      })
      .catch((err) => console.error("Failed to load (store.settings as any)", err))
      .finally(() => setIsLoadingIndustry(false));

    // Fetch real store status and URL from API
    fetch("/api/storefront/url")
      .then((res) => res.json())
      .then((data) => setStoreLink(data.url))
      .catch(() => setStoreLink(""));

    fetch("/api/storefront/status")
      .then((res) => res.json())
      .then((data) => setStoreStatus(data.status))
      .catch(() => { });
  }, [router, pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleVisitStore = (e: React.MouseEvent) => {
    if (!storeLink) {
      e.preventDefault();
      toast.error("Store URL not yet generated. Please complete onboarding.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Grouped Navigation Logic
  // Dynamic based on industrySlug and persistent enabled extensions
  const visibleGroups = industrySlug ? getSidebar(industrySlug, enabledExtensionIds) : SIDEBAR_GROUPS;

  // Sidebar Animation Variants
  const sidebarVariants = {
    desktopCollapsed: { width: 80, x: 0 },
    desktopExpanded: { width: 260, x: 0 },
    mobileHidden: { width: 280, x: "-100%" },
    mobileVisible: { width: 280, x: 0 },
  };

  const currentVariant = isMobile
    ? mobileMenuOpen
      ? "mobileVisible"
      : "mobileHidden"
    : isSidebarExpanded
      ? "desktopExpanded"
      : "desktopCollapsed";

  // Bottom Navigation Logic
  const bottomNavItems: { name: string; icon: IconName; href: string }[] = [
    { name: "Home", icon: "LayoutDashboard", href: "/dashboard" },
    { name: "Orders", icon: "ShoppingBag", href: "/dashboard/orders" },
    { name: "Products", icon: "Package", href: "/dashboard/products" },
    { name: "Earnings", icon: "Wallet", href: "/dashboard/finance" },
  ];

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-black font-sans">
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR (Drawer) */}
      <motion.aside
        className={cn(
          "fixed md:relative h-full z-50 flex flex-col border-r border-studio-border text-black bg-white",
          isMobile ? "top-0 left-0 shadow-2xl w-[280px]" : "",
        )}
        variants={sidebarVariants}
        initial={false}
        animate={currentVariant}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={() => !isMobile && setIsSidebarExpanded(true)}
        onMouseLeave={() => !isMobile && setIsSidebarExpanded(false)}
      >
        {/* Vayva Logo Top Left - Clickable to Dashboard */}
        <div className="h-[72px] md:h-[100px] flex items-center justify-start px-6 shrink-0 relative">
          <Logo
            href="/dashboard"
            size={isMobile ? "sm" : "lg"}
            showText={isMobile || isSidebarExpanded}
          />
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full hover:bg-gray-100 text-gray-500 ml-auto"
              aria-label="Close menu"
              title="Close menu"
            >
              <Icon name="X" size={24} />
            </Button>
          )}
        </div>

        {/* Mobile Only: Visit Store Button */}
        <div className="px-4 pb-2 md:hidden">
          <a
            href={storeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleVisitStore}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg",
              storeStatus === "live" && storeLink
                ? "bg-vayva-green text-white shadow-green-500/20"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <span>Visit Live Store</span>
            <Icon name="ExternalLink" size={16} />
          </a>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-4 py-4 px-3 overflow-hidden custom-scrollbar overflow-y-auto">
          {visibleGroups.map((group: SidebarGroup, groupIdx: number) => (
            <div key={groupIdx} className="flex flex-col gap-1">
              {group.name && (
                <div className={cn(
                  "px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1 mt-1 transition-opacity duration-200",
                  (!isSidebarExpanded && !isMobile) ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
                )}>
                  {group.name}
                </div>
              )}
              {group.items.map((item: any) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const isLocked = mode === "onboarding";

                return (
                  <Link
                    key={item.name}
                    href={isLocked ? "#" : item.href}
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium relative group whitespace-nowrap overflow-hidden shrink-0",
                      isActive && !isLocked
                        ? "bg-studio-gray text-black font-black border-r-4 border-vayva-green"
                        : isLocked
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:text-black hover:bg-studio-gray",
                    )}
                    title={(!isSidebarExpanded && !isMobile) ? item.name : undefined}
                  >
                    <Icon
                      name={item.icon as IconName}
                      size={18}
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-black" : "text-gray-400 group-hover:text-gray-600",
                      )}
                    />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isMobile || isSidebarExpanded ? 1 : 0 }}
                      className="block truncate"
                    >
                      {item.name}
                    </motion.span>
                    {isLocked && (
                      <Icon
                        name="Lock"
                        size={12}
                        className="ml-auto opacity-50 shrink-0"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Control Center - Removed manual block as it's now in System group */}
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full flex flex-col relative overflow-hidden bg-white">
        <GlobalBanner />

        {/* Top Command Bar */}
        <header className="h-[60px] md:h-[72px] w-full glass-panel flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30 sticky top-0">
          <div className="flex items-center gap-4 md:gap-6">
            <Logo href="/dashboard" size="sm" showText={true} className="md:hidden" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <a
              href={storeLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleVisitStore}
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm",
                storeStatus === "live" && storeLink
                  ? "bg-vayva-green text-white hover:bg-vayva-green/90 shadow-green-500/10"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
              )}
            >
              Visit Store <Icon name="ExternalLink" size={12} />
            </a>

            <CommandPalette />
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-900"
              onClick={() => (window as any).triggerCommandPalette?.()}
            >
              <Icon name="Search" size={20} />
            </Button>

            <NotificationBell
              isOpen={isNotifOpen}
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            />

            <NotificationCenter
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
            />

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

            {/* Avatar / User Menu (Header Top Right) */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors h-auto"
                id="user-menu-button"
                aria-label="User menu"
                title="User menu"
              >
                <Avatar
                  src={storeLogo || user?.avatarUrl || user?.image || undefined}
                  fallback={initials}
                  className="bg-indigo-600"
                />
                <Icon
                  name="ChevronDown"
                  size={16}
                  className="text-gray-400 hidden sm:block"
                />
              </Button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                  >
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-gray-900">
                        {merchantName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Owner Identity
                      </p>
                    </div>
                    <div className="p-1">
                      {ACCOUNT_DROPDOWN_ITEMS.map((item: any) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            onClick={() => setShowUserMenu(false)}
                            className="w-full justify-start items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-black hover:bg-studio-gray rounded-lg transition-colors text-left font-bold h-auto"
                          >
                            <Icon name={item.icon as any} size={16} />
                            {item.name}
                          </Button>
                        </Link>
                      ))}

                      <div className="h-px bg-gray-50 my-1" />

                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 text-left group font-normal h-auto"
                        title="Sign out"
                        aria-label="Sign out"
                      >
                        <Icon name="LogOut" size={16} />
                        Sign out
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-3 md:px-8 py-3 md:py-8 custom-scrollbar pb-24 md:pb-8">
          <div className="max-w-[1400px] mx-auto min-h-full">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, translateY: "10px" }}
              animate={{ opacity: 1, translateY: "0px" }}
              exit={{ opacity: 0, translateY: "-10px" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION (Mobile Only) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-safe z-40 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {bottomNavItems.map((item: any) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-0.5 min-w-[56px] relative"
                aria-label={item.name}
              >
                <div
                  className={cn(
                    "p-2 rounded-2xl transition-all duration-300",
                    isActive
                      ? "bg-vayva-green text-white shadow-lg shadow-green-500/20 scale-110 -translate-y-1"
                      : "text-gray-400 hover:text-gray-600",
                  )}
                >
                  <Icon name={item.icon as any} size={22} />
                </div>
                <span
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-tight transition-colors",
                    isActive ? "text-gray-900" : "text-gray-400",
                  )}
                >
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActive"
                    className="absolute -top-1 w-1 h-1 bg-vayva-green rounded-full"
                  />
                )}
              </Link>
            );
          })}
          {/* Menu Trigger */}
          <Button
            variant="ghost"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 min-w-[56px] h-auto p-0 hover:bg-transparent"
          >
            <div
              className={cn(
                "p-2 rounded-2xl transition-colors",
                mobileMenuOpen ? "bg-vayva-green text-white" : "text-gray-400",
              )}
            >
              <Icon name="Menu" size={22} />
            </div>
            <span
              className={cn(
                "text-[9px] font-bold uppercase tracking-tight",
                mobileMenuOpen ? "text-gray-900" : "text-gray-400",
              )}
            >
              More
            </span>
          </Button>
        </div>
      </main>

      {/* Simple Background overlay for mobile User Menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
      <SupportChat />
      <CommandPalette />
    </div>
  );
};
