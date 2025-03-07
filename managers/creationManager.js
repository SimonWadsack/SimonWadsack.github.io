import { Vector3 } from 'three';
import { BezierCurveObject } from '../objects/bezierCurveObject.js';

class CreationManager {
    objectManager;
    constructor(objectManager) {
        this.objectManager = objectManager;
    }
    createBasicBezierCurve() {
        const controlPoints = [new Vector3(-5, 0, 0), new Vector3(0, 5, 0), new Vector3(5, 0, 0)];
        const colors = [0x27ae60, 0x2980b9, 0x8e44ad, 0x16a085, 0xf39c12, 0xd35400, 0xc0392b, 0x7f8c8d];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const bezierCurveObject = new BezierCurveObject('Basic BezierCurve', controlPoints, color);
        this.objectManager.addObject(bezierCurveObject);
        return bezierCurveObject;
    }
}

export { CreationManager };
