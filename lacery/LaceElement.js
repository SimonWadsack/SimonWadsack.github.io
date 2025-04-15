class LaceElement {
    label;
    element;
    onChangeCallback = () => { };
    updateCallbacks = [];
    constructor(label, element) {
        this.label = label;
        this.element = element;
    }
    onChange(callback) {
        this.onChangeCallback = callback;
        return this;
    }
    changed() {
        this.onChangeCallback();
        for (const callback of this.updateCallbacks) {
            callback();
        }
    }
    registerUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
    }
    deregisterUpdateCallback(callback) {
        const index = this.updateCallbacks.indexOf(callback);
        if (index !== -1) {
            this.updateCallbacks.splice(index, 1);
        }
    }
}

export { LaceElement };
