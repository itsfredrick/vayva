// Push Notification Service
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

export const PushService = {
    async isSupported(): Promise<boolean> {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    },

    async requestPermission(): Promise<NotificationPermission> {
        return await Notification.requestPermission();
    },

    async subscribe(): Promise<PushSubscription | null> {
        if (!await this.isSupported()) return null;

        const permission = await this.requestPermission();
        if (permission !== 'granted') return null;

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as any
        });

        // Register with backend
        await this.registerDevice(subscription);
        return subscription;
    },

    async registerDevice(subscription: PushSubscription): Promise<void> {
        await fetch('/api/push/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pushToken: JSON.stringify(subscription),
                deviceType: 'WEB_PUSH'
            })
        });
    },

    async unsubscribe(): Promise<void> {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
            await fetch('/api/push/unregister', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pushToken: JSON.stringify(subscription) })
            });
        }
    },

    urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        return Uint8Array.from(Array.from(rawData).map(char => char.charCodeAt(0)));
    }
};
