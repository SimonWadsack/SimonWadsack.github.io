import { Vector3 } from 'three';
import { BezierCurveObject } from '../objects/bezierCurveObject.js';

class CreationManager{
    constructor(objectManager){
        this.objectManager = objectManager;
    }

    createBasicBezierCurve(){
        const controlPoints = [new Vector3(-5, 0, 0), new Vector3(0, 5, 0), new Vector3(5, 0, 0)];
        const colors = [0x27ae60, 0x2980b9, 0x8e44ad, 0x16a085, 0xf39c12, 0xd35400, 0xc0392b, 0x7f8c8d];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const bezierCurveObject = new BezierCurveObject('Basic BezierCurve', controlPoints, color);
        this.objectManager.addObject(bezierCurveObject);
        return bezierCurveObject;
    }

    /*createBezierCurveEditor(curveMesh){
        const controlPoints = curveMesh.userData.controlPoints;
        var editHandles = new Map();
        const geometry = new SphereGeometry(0.2);
        const material = new MeshBasicMaterial({color: 0x0000ff});
        for(let i = 0; i < controlPoints.length; i++){
            const handle = new Mesh(geometry, material);
            handle.castShadow = true;
            handle.position.copy(controlPoints[i]);
            editHandles.set(i, handle);
            this.objectManager.addEditObject(handle, curveMesh);
        }

        return editHandles;
    }*/
}

export { CreationManager };
