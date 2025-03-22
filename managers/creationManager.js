import { Vector3, Color } from 'three';
import { BezierCurveObject } from '../objects/bezierCurveObject.js';
import { App } from '../core/app.js';

class CreationManager {
    constructor() {
    }
    createBasicBezierCurve() {
        const controlPoints = [new Vector3(-5, 0, 0), new Vector3(0, 5, -5), new Vector3(5, 0, 0)];
        //"#27ae60", "#2980b9", "#8e44ad", "#16a085", "#f39c12", "#d35400", "#c0392b", 
        const colors = ["#7f8c8d"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const bezierCurveObject = new BezierCurveObject('Bezier Curve', controlPoints, new Color(color));
        bezierCurveObject.enableEditControlPoint();
        App.getObjectManager().addObject(bezierCurveObject);
        return bezierCurveObject;
    }
}

export { CreationManager };
