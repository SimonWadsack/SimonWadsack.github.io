import { EventBus } from '../core/events.js';

class EditManager{
    constructor(objectManager){
        this.objectManager = objectManager;
        this.updateCallback = null;
        this.selectedObject = null;

        EventBus.subscribe('objectSelected', (object) => this.selectObject(object));
        EventBus.subscribe('objectUnselected', () => this.unselectObject());
    }

    update(){
        if(this.updateCallback){
            this.updateCallback();
        }
    }

    selectObject(object){
        this.selectedObject = object;
        this.updateCallback = this.selectedObject.edit();
    }

    unselectObject(){
        this.updateCallback = null;
        this.selectedObject.unedit();
        this.selectedObject = null;
    }

    /*selectBezierCurve(curveMesh){
        this.editHandles = this.creationManager.createBezierCurveEditor(curveMesh);
        this.updateCallback = this.updateBezierCurve.bind(this, curveMesh);
    }

    updateBezierCurve(curveMesh){
        const controlPoints = curveMesh.userData.controlPoints;
        for(let i = 0; i < controlPoints.length; i++){
            const handle = this.editHandles.get(i);
            updateControlPoint(curveMesh, i, handle.position);
        }
    }*/
}

export { EditManager };
