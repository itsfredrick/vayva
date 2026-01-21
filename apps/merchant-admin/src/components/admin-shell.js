"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button, Icon, cn } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationBell } from "./notifications/NotificationBell";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { GlobalBanner } from "./notifications/GlobalBanner";
import { Logo } from "./Logo";
import { SupportChat } from "./support/support-chat";
import { CommandPalette } from "./ai/CommandPalette";
import { extensionRegistry } from "@/lib/extensions/registry";
import { getSidebar, SIDEBAR_GROUPS } from "@/config/sidebar";
// ... (other imports)
const ACCOUNT_DROPDOWN_ITEMS = [
    { name: "My Profile", href: "/dashboard/settings/profile", icon: "User" },
    { name: "Store Settings", href: "/dashboard/settings/store", icon: "Settings" },
    { name: "Billing", href: "/dashboard/settings/billing", icon: "CreditCard" },
];
export const AdminShell = ({ children, title, breadcrumb, mode = "admin", }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, merchant, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [industrySlug, setIndustrySlug] = useState(null);
    const [enabledExtensionIds, setEnabledExtensionIds] = useState([]);
    const [isLoadingIndustry, setIsLoadingIndustry] = useState(true);
    // Mobile State
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Notification UI State
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    // Initial logic for "FD" avatar
    // Cast to any as the session types might be generic
    const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "FD";
    // Fallback Merchant Details
    const merchantName = merchant?.firstName || user?.firstName || "Merchant";
    const storeName = merchant?.businessName || "My Store";
    // Store URL logic
    const [storeLink, setStoreLink] = useState("");
    const [storeStatus, setStoreStatus] = useState("draft");
    const [storeLogo, setStoreLogo] = useState(null);
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile)
                setMobileMenuOpen(false); // Reset on resize to desktop
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
            const fetchedIndustry = merchantData.industrySlug;
            // Critical Redirect Logic
            // If no industry set, and we are NOT already on the settings page, redirect.
            // MIGRATION FIX: If industry is missing, force them to the new onboarding step
            // We added a whitelist for the target page to avoid loops
            if (!fetchedIndustry && !pathname.includes("/onboarding/industry")) {
                router.push("/onboarding/industry");
            }
            else {
                setIndustrySlug(fetchedIndustry);
            }
            if (merchantData.enabledExtensionIds) {
                setEnabledExtensionIds(merchantData.enabledExtensionIds);
            }
            if (merchantData.externalManifests) {
                merchantData.externalManifests.forEach((manifest) => {
                    extensionRegistry.register(manifest);
                });
            }
        })
            .catch((err) => console.error("Failed to load store settings", err))
            .finally(() => setIsLoadingIndustry(false));
        // Fetch real store status and URL from API
        fetch("/api/storefront/url")
            .then((res) => res.json())
            .then((data) => setStoreLink(data.url))
            .catch(() => setStoreLink("#"));
        fetch("/api/storefront/status")
            .then((res) => res.json())
            .then((data) => setStoreStatus(data.status))
            .catch(() => { });
    }, [router, pathname]);
    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);
    const handleVisitStore = (e) => {
        if (!storeLink || storeLink === "#") {
            e.preventDefault();
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
    const bottomNavItems = [
        { name: "Home", icon: "LayoutDashboard", href: "/dashboard" },
        { name: "Orders", icon: "ShoppingBag", href: "/dashboard/orders" },
        { name: "Products", icon: "Package", href: "/dashboard/products" },
        { name: "Earnings", icon: "Wallet", href: "/dashboard/finance" },
    ];
    return (_jsxs("div", { className: "flex h-screen w-full bg-white overflow-hidden text-black font-sans", children: [_jsx(AnimatePresence, { children: isMobile && mobileMenuOpen && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 0.5 }, exit: { opacity: 0 }, onClick: () => setMobileMenuOpen(false), className: "fixed inset-0 bg-black z-40 md:hidden" })) }), _jsxs(motion.aside, { className: cn("fixed md:relative h-full z-50 flex flex-col border-r border-studio-border text-black bg-white", isMobile ? "top-0 left-0 shadow-2xl w-[280px]" : ""), variants: sidebarVariants, initial: false, animate: currentVariant, transition: { type: "spring", stiffness: 300, damping: 30 }, onMouseEnter: () => !isMobile && setIsSidebarExpanded(true), onMouseLeave: () => !isMobile && setIsSidebarExpanded(false), children: [_jsxs("div", { className: "h-[72px] md:h-[100px] flex items-center justify-start px-6 shrink-0 relative", children: [_jsx(Logo, { href: "/dashboard", size: isMobile ? "sm" : "lg", showText: isMobile || isSidebarExpanded }), isMobile && (_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setMobileMenuOpen(false), className: "rounded-full hover:bg-gray-100 text-gray-500 ml-auto", "aria-label": "Close menu", title: "Close menu", children: _jsx(Icon, { name: "X", size: 24 }) }))] }), _jsx("div", { className: "px-4 pb-2 md:hidden", children: _jsxs("a", { href: storeLink, target: "_blank", rel: "noopener noreferrer", onClick: handleVisitStore, className: cn("w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg", storeStatus === "live"
                                ? "bg-vayva-green text-white shadow-green-500/20"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"), children: [_jsx("span", { children: "Visit Live Store" }), _jsx(Icon, { name: "ExternalLink", size: 16 })] }) }), _jsx("nav", { className: "flex-1 flex flex-col gap-4 py-4 px-3 overflow-hidden custom-scrollbar overflow-y-auto", children: visibleGroups.map((group, groupIdx) => (_jsxs("div", { className: "flex flex-col gap-1", children: [group.name && (_jsx("div", { className: cn("px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1 mt-1 transition-opacity duration-200", (!isSidebarExpanded && !isMobile) ? "opacity-0 h-0 overflow-hidden" : "opacity-100"), children: group.name })), group.items.map((item) => {
                                    const isActive = pathname === item.href ||
                                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                    const isLocked = mode === "onboarding";
                                    return (_jsxs(Link, { href: isLocked ? "#" : item.href, onClick: () => isMobile && setMobileMenuOpen(false), className: cn("flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium relative group whitespace-nowrap overflow-hidden shrink-0", isActive && !isLocked
                                            ? "bg-studio-gray text-black font-black border-r-4 border-vayva-green"
                                            : isLocked
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "text-gray-500 hover:text-black hover:bg-studio-gray"), title: (!isSidebarExpanded && !isMobile) ? item.name : undefined, children: [_jsx(Icon, { name: item.icon, size: 18, className: cn("shrink-0 transition-colors", isActive ? "text-black" : "text-gray-400 group-hover:text-gray-600") }), _jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: isMobile || isSidebarExpanded ? 1 : 0 }, className: "block truncate", children: item.name }), isLocked && (_jsx(Icon, { name: "Lock", size: 12, className: "ml-auto opacity-50 shrink-0" }))] }, item.name));
                                })] }, groupIdx))) })] }), _jsxs("main", { className: "flex-1 h-full flex flex-col relative overflow-hidden bg-white", children: [_jsx(GlobalBanner, {}), _jsxs("header", { className: "h-[60px] md:h-[72px] w-full glass-panel flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30 sticky top-0", children: [_jsx("div", { className: "flex items-center gap-4 md:gap-6", children: _jsx(Logo, { href: "/dashboard", size: "sm", showText: true, className: "md:hidden" }) }), _jsxs("div", { className: "flex items-center gap-2 md:gap-4", children: [_jsxs("a", { href: storeLink, target: "_blank", rel: "noopener noreferrer", onClick: handleVisitStore, className: cn("hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm", storeStatus === "live"
                                            ? "bg-vayva-green text-white hover:bg-vayva-green/90 shadow-green-500/10"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"), children: ["Visit Store ", _jsx(Icon, { name: "ExternalLink", size: 12 })] }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-gray-400 hover:text-gray-900", children: _jsx(Icon, { name: "Search", size: 20 }) }), _jsx(NotificationBell, { isOpen: isNotifOpen, onClick: () => setIsNotifOpen(!isNotifOpen) }), _jsx(NotificationCenter, { isOpen: isNotifOpen, onClose: () => setIsNotifOpen(false) }), _jsx("div", { className: "h-6 w-px bg-gray-200 mx-1 hidden sm:block" }), _jsxs("div", { className: "relative", children: [_jsxs(Button, { variant: "ghost", onClick: () => setShowUserMenu(!showUserMenu), className: "flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors h-auto", id: "user-menu-button", "aria-label": "User menu", title: "User menu", children: [_jsx(Avatar, { src: storeLogo || user?.avatarUrl || user?.image || undefined, fallback: initials, className: "bg-indigo-600" }), _jsx(Icon, { name: "ChevronDown", size: 16, className: "text-gray-400 hidden sm:block" })] }), _jsx(AnimatePresence, { children: showUserMenu && (_jsxs(motion.div, { initial: { opacity: 0, y: 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 10, scale: 0.95 }, transition: { duration: 0.1 }, className: "absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 py-1", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-50 mb-1", children: [_jsx("p", { className: "text-sm font-bold text-gray-900", children: merchantName }), _jsx("p", { className: "text-xs text-gray-500 truncate", children: "Owner Identity" })] }), _jsxs("div", { className: "p-1", children: [ACCOUNT_DROPDOWN_ITEMS.map((item) => (_jsx(Link, { href: item.href, children: _jsxs(Button, { variant: "ghost", onClick: () => setShowUserMenu(false), className: "w-full justify-start items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-black hover:bg-studio-gray rounded-lg transition-colors text-left font-bold h-auto", children: [_jsx(Icon, { name: item.icon, size: 16 }), item.name] }) }, item.href))), _jsx("div", { className: "h-px bg-gray-50 my-1" }), _jsxs(Button, { variant: "ghost", onClick: handleLogout, className: "w-full justify-start items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 text-left group font-normal h-auto", title: "Sign out", "aria-label": "Sign out", children: [_jsx(Icon, { name: "LogOut", size: 16 }), "Sign out"] })] })] })) })] })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto px-3 md:px-8 py-3 md:py-8 custom-scrollbar pb-24 md:pb-8", children: _jsx("div", { className: "max-w-[1400px] mx-auto min-h-full", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3, ease: "easeOut" }, children: children }, pathname) }) }), _jsxs("div", { className: "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-safe z-40 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]", children: [bottomNavItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (_jsxs(Link, { href: item.href, className: "flex flex-col items-center gap-0.5 min-w-[56px] relative", "aria-label": item.name, children: [_jsx("div", { className: cn("p-2 rounded-2xl transition-all duration-300", isActive
                                                ? "bg-vayva-green text-white shadow-lg shadow-green-500/20 scale-110 -translate-y-1"
                                                : "text-gray-400 hover:text-gray-600"), children: _jsx(Icon, { name: item.icon, size: 22 }) }), _jsx("span", { className: cn("text-[9px] font-bold uppercase tracking-tight transition-colors", isActive ? "text-gray-900" : "text-gray-400"), children: item.name }), isActive && (_jsx(motion.div, { layoutId: "bottomNavActive", className: "absolute -top-1 w-1 h-1 bg-vayva-green rounded-full" }))] }, item.name));
                            }), _jsxs(Button, { variant: "ghost", onClick: () => setMobileMenuOpen(true), className: "flex flex-col items-center gap-0.5 min-w-[56px] h-auto p-0 hover:bg-transparent", children: [_jsx("div", { className: cn("p-2 rounded-2xl transition-colors", mobileMenuOpen ? "bg-vayva-green text-white" : "text-gray-400"), children: _jsx(Icon, { name: "Menu", size: 22 }) }), _jsx("span", { className: cn("text-[9px] font-bold uppercase tracking-tight", mobileMenuOpen ? "text-gray-900" : "text-gray-400"), children: "More" })] })] })] }), showUserMenu && (_jsx("div", { className: "fixed inset-0 z-30", onClick: () => setShowUserMenu(false) })), _jsx(SupportChat, {}), _jsx(CommandPalette, {})] }));
};
