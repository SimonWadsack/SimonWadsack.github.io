/**
 * EventBus is a simple event management system that allows subscribing to, unsubscribing from,
 * and notifying events.
 */
const EventBus = {
    events: new Map(),
    /**
     * Subscribes a callback function to a specific event.
     * @param {string} event - The name of the event to subscribe to.
     * @param {Function} callback - The callback function to be executed when the event is triggered.
     */
    subscribe(event, env, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Map());
        }
        const envMap = this.events.get(event);
        if (!envMap.has(env)) {
            envMap.set(env, []);
        }
        envMap.get(env).push(callback);
    },
    /**
     * Unsubscribes a callback function from a specific event.
     * @param {string} event - The name of the event to unsubscribe from.
     * @param {Function} callback - The callback function to be removed.
     */
    unsubscribe(event, env, callback) {
        if (this.events.has(event)) {
            const envMap = this.events.get(event);
            if (envMap.has(env)) {
                const index = envMap.get(env).indexOf(callback);
                if (index !== -1)
                    envMap.get(env).splice(index, 1);
            }
        }
    },
    /**
     * Notifies all the subscribed callbacks of a specific event.
     * @param {string} event - The name of the event to notify.
     * @param {any} data - The data to be passed to the callback functions.
     */
    notify(event, env, data) {
        if (this.events.has(event)) {
            const envMap = this.events.get(event);
            for (const callback of envMap.get(env)) {
                callback(data);
            }
        }
    }
};

export { EventBus };
