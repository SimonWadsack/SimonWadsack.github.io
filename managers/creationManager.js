import { Vector3, Color } from 'three';
import { BezierCurveObject } from '../objects/bezierCurveObject.js';

class CreationManager {
    objectManager;
    constructor(objectManager) {
        this.objectManager = objectManager;
    }
    createBasicBezierCurve() {
        const controlPoints = [new Vector3(-5, 0, 0), new Vector3(0, 5, 0), new Vector3(5, 0, 0)];
        //"#27ae60", "#2980b9", "#8e44ad", "#16a085", "#f39c12", "#d35400", "#c0392b", 
        const colors = ["#7f8c8d"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const bezierCurveObject = new BezierCurveObject('Basic BezierCurve', controlPoints, new Color(color));
        this.objectManager.addObject(bezierCurveObject);
        return bezierCurveObject;
    }
}

export { CreationManager };
