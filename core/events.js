/**
 * EventBus is a simple event management system that allows subscribing to, unsubscribing from,
 * and notifying events.
 */
const EventBus = {
    events: {},

    /**
     * Subscribes a callback function to a specific event.
     * @param {string} event - The name of the event to subscribe to.
     * @param {Function} callback - The callback function to be executed when the event is triggered.
     */
    subscribe(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },

    /**
     * Unsubscribes a callback function from a specific event.
     * @param {string} event - The name of the event to unsubscribe from.
     * @param {Function} callback - The callback function to be removed.
     */
    unsubscribe(event, callback) {
        if (this.events[event]) this.events[event] = this.events[event].filter(cb => cb !== callback);
    },

    /**
     * Notifies all the subscribed callbacks of a specific event.
     * @param {string} event - The name of the event to notify.
     * @param {*} data - The data to be passed to the callback functions.
     */
    notify(event, data) {
        if (this.events[event]){
            this.events[event].forEach(cb => cb(data));
        }
    }
};

export { EventBus };
