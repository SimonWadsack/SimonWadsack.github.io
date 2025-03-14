import { EventBus } from '../core/events.js';

class EditManager {
    updateCallback;
    selectedObject;
    constructor() {
        this.updateCallback = null;
        this.selectedObject = null;
        EventBus.subscribe('objectSelected', "general" /* EEnv.GENERAL */, (object) => this.selectObject(object));
        EventBus.subscribe('objectUnselected', "general" /* EEnv.GENERAL */, () => this.unselectObject());
        EventBus.subscribe('objectChanged', "general" /* EEnv.GENERAL */, () => this.update());
    }
    update() {
        if (this.updateCallback) {
            this.updateCallback();
        }
    }
    selectObject(object) {
        if (!object) {
            console.error('editManager:selectObject: Object is null!');
            return;
        }
        this.selectedObject = object;
        this.updateCallback = this.selectedObject.edit();
    }
    unselectObject() {
        if (!this.selectedObject) {
            console.error('editManager:unselectObject: Object is null!');
            return;
        }
        this.updateCallback = null;
        this.selectedObject.unedit();
        this.selectedObject = null;
    }
}

export { EditManager };
