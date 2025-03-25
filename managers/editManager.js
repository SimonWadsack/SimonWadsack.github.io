import { EventBus } from '../core/events.js';

class EditManager {
    updateCallback;
    selectedObject;
    constructor() {
        this.updateCallback = null;
        this.selectedObject = null;
        EventBus.subscribe('objectSelected', "all" /* EEnv.ALL */, (object) => this.selectObject(object));
        EventBus.subscribe('objectUnselected', "all" /* EEnv.ALL */, () => this.unselectObject());
        EventBus.subscribe('objectChanged', "all" /* EEnv.ALL */, () => this.update());
        EventBus.subscribe('transformMoved', "viewport" /* EEnv.VIEWPORT */, () => this.update());
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
