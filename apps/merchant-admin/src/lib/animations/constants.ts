// Enhanced Tailwind animations for Shopify-level polish
export const animations = {
    // Button animations
    buttonHover: "transition-all duration-200 hover:scale-102 hover:shadow-lg active:scale-98",
    buttonSuccess: "animate-bounce-once",
    // Loading states
    pulse: "animate-pulse",
    spin: "animate-spin",
    // Entry animations
    fadeIn: "animate-fade-in",
    slideInRight: "animate-slide-in-right",
    slideInLeft: "animate-slide-in-left",
    slideInUp: "animate-slide-in-up",
    slideInDown: "animate-slide-in-down",
    // Exit animations
    fadeOut: "animate-fade-out",
    slideOutRight: "animate-slide-out-right",
    // Interactive feedback
    shake: "animate-shake",
    wiggle: "animate-wiggle",
    // Success states
    checkmark: "animate-checkmark",
    // Number counters
    countUp: "animate-count-up",
};
// Tailwind config additions (add to tailwind.config.ts)
export const tailwindAnimations = {
    keyframes: {
        "fade-in": {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
        },
        "fade-out": {
            "0%": { opacity: "1" },
            "100%": { opacity: "0" },
        },
        "slide-in-right": {
            "0%": { transform: "translateX(100%)", opacity: "0" },
            "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
            "0%": { transform: "translateX(-100%)", opacity: "0" },
            "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-up": {
            "0%": { transform: "translateY(100%)", opacity: "0" },
            "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-down": {
            "0%": { transform: "translateY(-100%)", opacity: "0" },
            "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out-right": {
            "0%": { transform: "translateX(0)", opacity: "1" },
            "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "shake": {
            "0%, 100%": { transform: "translateX(0)" },
            "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
            "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
        "wiggle": {
            "0%, 100%": { transform: "rotate(0deg)" },
            "25%": { transform: "rotate(-3deg)" },
            "75%": { transform: "rotate(3deg)" },
        },
        "bounce-once": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
        },
        "checkmark": {
            "0%": { strokeDashoffset: "100" },
            "100%": { strokeDashoffset: "0" },
        },
    },
    animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-in-up": "slide-in-up 0.3s ease-out",
        "slide-in-down": "slide-in-down 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "shake": "shake 0.5s ease-in-out",
        "wiggle": "wiggle 0.5s ease-in-out",
        "bounce-once": "bounce-once 0.5s ease-in-out",
        "checkmark": "checkmark 0.6s ease-out forwards",
    },
};
