import { EventBus } from '../core/events.js';
import { BezierCurveObject } from '../objects/bezierCurveObject.js';
import { Lace } from '../lacery/Lace.js';
import { BezierCurveInspector } from './inspectors/bezierCurveInspector.js';

class Inspector {
    lace;
    currentInspector;
    objectInspectors;
    constructor(container) {
        this.currentInspector = null;
        this.lace = new Lace(container);
        this.objectInspectors = new Map();
        this.objectInspectors.set('bezierCurve', new BezierCurveInspector(this.lace));
        EventBus.subscribe('objectSelected', "all" /* EEnv.ALL */, (object) => this.updateInspector(object));
        EventBus.subscribe('objectUnselected', "all" /* EEnv.ALL */, () => this.updateInspector(null));
        EventBus.subscribe('objectRemoved', "all" /* EEnv.ALL */, () => this.updateInspector(null));
        EventBus.subscribe('objectChanged', "viewport" /* EEnv.VIEWPORT */, () => this.objectChanged());
    }
    updateInspector(object) {
        if (!object) {
            this.lace.hideAll();
            this.currentInspector?.deselect();
            this.currentInspector = null;
            return;
        }
        var inspector = undefined;
        if (object instanceof BezierCurveObject) {
            inspector = this.objectInspectors.get('bezierCurve');
        }
        if (inspector) {
            inspector.select(object);
            this.currentInspector = inspector;
        }
        else {
            this.lace.hideAll();
            this.currentInspector = null;
        }
    }
    objectChanged() {
        if (!this.currentInspector)
            return;
        this.currentInspector.objectChanged();
    }
}

export { Inspector };
