import { EventTarget } from "cc";

type ListenerDetail = {
    eventName: string;
    method: (...args: any[]) => void;
};

export default class EmitterManager {
    private static instance: EmitterManager | null = null;

    private eventTarget: EventTarget;
    private listenerMap: Map<any, ListenerDetail[]>;

    private constructor() {
        this.eventTarget = new EventTarget();
        this.listenerMap = new Map();
    }

    // Singleton
    public static getInstance(): EmitterManager {
        if (!EmitterManager.instance) {
            EmitterManager.instance = new EmitterManager();
        }
        return EmitterManager.instance;
    }

    // Emit event
    public emit(eventName: string, ...args: any[]): void {
        this.eventTarget.emit(eventName, ...args);
    }

    // Register event
    public registerEvent(
        eventName: string,
        method: (...args: any[]) => void,
        owner?: any
    ): void {
        if (owner) {
            if (!this.listenerMap.has(owner)) {
                this.listenerMap.set(owner, []);
            }
            
            const list = this.listenerMap.get(owner)!;
            
            for (let detail of list) {
                if (detail.eventName === eventName && detail.method === method) {
                    console.log("Event existed");
                    return;
                }
            }
            
            list.push({ eventName, method });
            this.eventTarget.on(eventName, method, owner);
        }
    }

    // Register once
    public registerOne(
        eventName: string,
        method: (...args: any[]) => void,
        owner?: any
    ): void {
        this.eventTarget.once(eventName, method, owner);
    }

    // Remove specific event
    public removeEvent(
        eventName: string,
        method: (...args: any[]) => void,
        owner?: any
    ): void {
        this.eventTarget.off(eventName, method, owner);
    }

    // Remove all events by owner
    public removeAllEvents(owner: any): void {
        if (!this.listenerMap.has(owner)) return;

        const listeners = this.listenerMap.get(owner)!;

        listeners.forEach(({ eventName, method }) => {
            this.eventTarget.off(eventName, method, owner);
        });

        this.listenerMap.delete(owner);

        console.log(`Listener remain: ${this.listenerMap.size}`);
    }

    // Destroy
    public destroy(): void {
        this.eventTarget = new EventTarget();
        this.listenerMap.clear();
        EmitterManager.instance = null;
    }
}