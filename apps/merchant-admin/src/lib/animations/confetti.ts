"use client";
import confetti from "canvas-confetti";
export const triggerConfetti = (options: any) => {
    const defaults = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    };
    confetti({
        ...defaults,
        ...options,
    });
};
export const triggerSuccessConfetti = () => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
    };
    function fire(particleRatio: any, opts: any) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        });
    }
    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};
export const triggerSideConfetti = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    const frame = () => {
        if (Date.now() > end)
            return;
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors: colors,
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors: colors,
        });
        requestAnimationFrame(frame);
    };
    frame();
};
