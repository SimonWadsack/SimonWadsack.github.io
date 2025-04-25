import { EventBus } from '../core/events.js';
import { BezierCurveObject } from '../objects/bezierCurveObject.js';
import { Lace } from 'lacery';
import { BezierCurveInspector } from './inspectors/bezierCurveInspector.js';
import { LinearCurveInspector } from './inspectors/linearCurveInspector.js';
import { LinearCurveObject } from '../objects/linearCurveObject.js';
import { UniformBSplineInspector } from './inspectors/uniformBSplineInspector.js';
import { UniformBSplineObject } from '../objects/uniformBSplineObject.js';
import { UniformRationalBSplineObject } from '../objects/uniformRationalBSplineObject.js';
import { UniformRationalBSplineInspector } from './inspectors/uniformRationalBSplineInspector.js';
import { BezierSplineInspector } from './inspectors/bezierSplineInspector.js';
import { BezierSplineObject } from '../objects/bezierSplineObject.js';
import { BezierPatchObject } from '../objects/bezierPatchObject.js';
import { BezierPatchInspector } from './inspectors/bezierPatchInspector.js';
import { UniformBSplineSurfaceInspector } from './inspectors/uniformBSplineSurfaceInspector.js';
import { UniformBSplineSurfaceObject } from '../objects/uniformBSplineSurfaceObject.js';
import { UniformRationalBSplineSurfaceObject } from '../objects/uniformRationalBSplineSurfaceObject.js';
import { UniformRationalBSplineSurfaceInspector } from './inspectors/uniformRationalBSplineSurfaceInspector.js';

class Inspector {
    lace;
    currentInspector;
    objectInspectors;
    constructor(container) {
        this.currentInspector = null;
        this.lace = new Lace(container);
        this.objectInspectors = new Map();
        this.objectInspectors.set('linearCurve', new LinearCurveInspector(this.lace));
        this.objectInspectors.set('bezierCurve', new BezierCurveInspector(this.lace));
        this.objectInspectors.set('bezierSpline', new BezierSplineInspector(this.lace));
        this.objectInspectors.set('uniformBSplineCurve', new UniformBSplineInspector(this.lace));
        this.objectInspectors.set('urbsCurve', new UniformRationalBSplineInspector(this.lace));
        this.objectInspectors.set('bezierPatch', new BezierPatchInspector(this.lace));
        this.objectInspectors.set('uniformBSplineSurface', new UniformBSplineSurfaceInspector(this.lace));
        this.objectInspectors.set('uniformRationalBSplineSurface', new UniformRationalBSplineSurfaceInspector(this.lace));
        EventBus.subscribe('objectSelected', "all" /* EEnv.ALL */, (object) => this.updateInspector(object));
        EventBus.subscribe('objectUnselected', "all" /* EEnv.ALL */, () => this.updateInspector(null));
        EventBus.subscribe('objectRemoved', "all" /* EEnv.ALL */, () => this.updateInspector(null));
        EventBus.subscribe('objectChanged', "viewport" /* EEnv.VIEWPORT */, () => this.objectChanged());
        EventBus.subscribe('transformMoved', "viewport" /* EEnv.VIEWPORT */, () => this.objectChanged());
    }
    updateInspector(object) {
        if (!object) {
            this.lace.hideAll();
            this.currentInspector?.deselect();
            this.currentInspector = null;
            return;
        }
        var inspector = undefined;
        if (object instanceof LinearCurveObject) {
            inspector = this.objectInspectors.get('linearCurve');
        }
        else if (object instanceof BezierCurveObject) {
            inspector = this.objectInspectors.get('bezierCurve');
        }
        else if (object instanceof BezierSplineObject) {
            inspector = this.objectInspectors.get('bezierSpline');
        }
        else if (object instanceof UniformBSplineObject) {
            inspector = this.objectInspectors.get('uniformBSplineCurve');
        }
        else if (object instanceof UniformRationalBSplineObject) {
            inspector = this.objectInspectors.get('urbsCurve');
        }
        else if (object instanceof BezierPatchObject) {
            inspector = this.objectInspectors.get('bezierPatch');
        }
        else if (object instanceof UniformBSplineSurfaceObject) {
            inspector = this.objectInspectors.get('uniformBSplineSurface');
        }
        else if (object instanceof UniformRationalBSplineSurfaceObject) {
            inspector = this.objectInspectors.get('uniformRationalBSplineSurface');
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
