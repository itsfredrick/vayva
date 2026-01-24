// Offline Storage Service using IndexedDB
const DB_NAME = "vayva-offline";
const DB_VERSION = 1;
class OfflineStorage {
    db: any;

    constructor() {
        this.db = null;
    }
    async init() {
        return new Promise((resolve: any, reject: any) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                // Action queue store
                if (!db.objectStoreNames.contains("actions")) {
                    const store = db.createObjectStore("actions", { keyPath: "id" });
                    store.createIndex("synced", "synced", { unique: false });
                }
                // Cache stores
                if (!db.objectStoreNames.contains("orders")) {
                    db.createObjectStore("orders", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("conversations")) {
                    db.createObjectStore("conversations", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("products")) {
                    db.createObjectStore("products", { keyPath: "id" });
                }
            };
        });
    }
    async queueAction(type: any, payload: any) {
        const action = {
            id: crypto.randomUUID(),
            type,
            payload,
            idempotencyKey: `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            createdAt: Date.now(),
            synced: false,
        };
        return new Promise((resolve: any, reject: any) => {
            const tx = this.db.transaction("actions", "readwrite");
            const store = tx.objectStore("actions");
            const request = store.add(action);
            request.onsuccess = () => resolve(action.id);
            request.onerror = () => reject(request.error);
        });
    }
    async getPendingActions() {
        return new Promise((resolve: any, reject: any) => {
            const tx = this.db.transaction("actions", "readonly");
            const store = tx.objectStore("actions");
            const index = store.index("synced");
            const request = index.getAll(IDBKeyRange.only(false));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    async markSynced(id: any) {
        return new Promise((resolve: any, reject: any) => {
            const tx = this.db.transaction("actions", "readwrite");
            const store = tx.objectStore("actions");
            const request = store.get(id);
            request.onsuccess = () => {
                const action = request.result;
                if (action) {
                    action.synced = true;
                    store.put(action);
                }
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }
    async cacheData(storeName: any, data: any) {
        return new Promise((resolve: any, reject: any) => {
            const tx = this.db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            store.clear();
            data.forEach((item: any) => store.put(item));
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
    async getCachedData(storeName: any) {
        return new Promise((resolve: any, reject: any) => {
            const tx = this.db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}
export const offlineStorage = new OfflineStorage();
