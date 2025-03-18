/**
 * EventBus is a simple event management system that allows subscribing to, unsubscribing from,
 * and notifying events.
 */
const EventBus = {
    allEvents: new Map(),
    generalEvents: new Map(),
    viewportEvents: new Map(),
    inspectorEvents: new Map(),
    hierarchyEvents: new Map(),
    /**
     * Subscribes a callback function to a specific event.
     * @param {string} event - The name of the event to subscribe to.
     * @param {Function} callback - The callback function to be executed when the event is triggered.
     */
    subscribe(event, env, callback) {
        let envMap;
        switch (env) {
            case "all" /* EEnv.ALL */:
                envMap = this.allEvents;
                break;
            case "general" /* EEnv.GENERAL */:
                envMap = this.generalEvents;
                break;
            case "viewport" /* EEnv.VIEWPORT */:
                envMap = this.viewportEvents;
                break;
            case "inspector" /* EEnv.INSPECTOR */:
                envMap = this.inspectorEvents;
                break;
            case "hierarchy" /* EEnv.HIERARCHY */:
                envMap = this.hierarchyEvents;
                break;
        }
        if (!envMap.has(event))
            envMap.set(event, []);
        envMap.get(event).push(callback);
    },
    /**
     * Unsubscribes a callback function from a specific event.
     * @param {string} event - The name of the event to unsubscribe from.
     * @param {Function} callback - The callback function to be removed.
     */
    unsubscribe(event, env, callback) {
        let envMap;
        switch (env) {
            case "all" /* EEnv.ALL */:
                envMap = this.allEvents;
                break;
            case "general" /* EEnv.GENERAL */:
                envMap = this.generalEvents;
                break;
            case "viewport" /* EEnv.VIEWPORT */:
                envMap = this.viewportEvents;
                break;
            case "inspector" /* EEnv.INSPECTOR */:
                envMap = this.inspectorEvents;
                break;
            case "hierarchy" /* EEnv.HIERARCHY */:
                envMap = this.hierarchyEvents;
                break;
        }
        if (envMap.has(event)) {
            const index = envMap.get(event).indexOf(callback);
            if (index !== -1)
                envMap.get(event).splice(index, 1);
        }
    },
    /**
     * Notifies all the subscribed callbacks of a specific event.
     * @param {string} event - The name of the event to notify.
     * @param {any} data - The data to be passed to the callback functions.
     */
    notify(event, env, data) {
        let envMap;
        switch (env) {
            case "all" /* EEnv.ALL */:
                {
                    for (const map of [this.allEvents, this.generalEvents, this.viewportEvents, this.inspectorEvents, this.hierarchyEvents]) {
                        if (map.has(event)) {
                            for (const callback of map.get(event)) {
                                callback(data);
                            }
                        }
                    }
                    return;
                }
            case "general" /* EEnv.GENERAL */:
                envMap = this.generalEvents;
                break;
            case "viewport" /* EEnv.VIEWPORT */:
                envMap = this.viewportEvents;
                break;
            case "inspector" /* EEnv.INSPECTOR */:
                envMap = this.inspectorEvents;
                break;
            case "hierarchy" /* EEnv.HIERARCHY */:
                envMap = this.hierarchyEvents;
                break;
        }
        if (envMap.has(event)) {
            for (const callback of envMap.get(event)) {
                callback(data);
            }
        }
        if (this.allEvents.has(event)) {
            for (const callback of this.allEvents.get(event)) {
                callback(data);
            }
        }
    }
};

export { EventBus };
