import { Vector3, Color, Raycaster, Plane, Vector4 } from 'three';
import { GroupControl, TextControl, KeyControl } from '../controls.js';
import { ObjectInspector, ObjectInspectorMode } from './objectInspector.js';
import { EventBus } from '../../core/events.js';
import { App } from '../../core/app.js';
import { getNewPosition } from '../../core/vars.js';
import { SliderElement, TextElement, Vec3Element, ColorElement, BooleanElement } from 'lacery';
import { ListElement, LaceListElement } from '../listElement.js';

class UniformRationalBSplineInspector extends ObjectInspector {
    constructor(lace) {
        const modes = [new ObjectMode(), new ControlPointMode()];
        super("Uniform Rational B-Spline", lace, modes);
    }
}
//#region Object Mode
class ObjectMode extends ObjectInspectorMode {
    params;
    degreeSlider;
    constructor() {
        const controls = new GroupControl();
        controls.add(new TextControl('<b>Move</b> the object with the transform control.'));
        super('box', true, controls);
        this.params = { name: '', position: new Vector3(), degree: 2, color: "#000000", closed: false };
        this.degreeSlider = new SliderElement("Degree", this.params, 'degree', { min: 2, max: 10, step: 1 });
    }
    build(tab) {
        tab.add(new TextElement("", this.params, 'name'));
        tab.add(new Vec3Element("Position", this.params.position, 'x', 'y', 'z'));
        tab.add(new ColorElement("Color", this.params, 'color'));
        tab.add(this.degreeSlider);
        tab.add(new BooleanElement("Closed", this.params, 'closed'));
    }
    select(object) { }
    deselect() { }
    objectChanged(object) {
        this.params.name = object.getName();
        this.params.position.set(object.getPosition().x, object.getPosition().y, object.getPosition().z);
        this.params.color = object.getColor().getHexString();
        this.params.degree = object.getDegree();
        this.degreeSlider.setMax(object.getControlPoints().length - 1);
        this.params.closed = object.isClosed();
    }
    inspectorChanged(object) {
        object.setName(this.params.name);
        object.setPosition(this.params.position);
        object.updateColor(new Color(this.params.color));
        object.setDegree(this.params.degree);
        object.setClosed(this.params.closed);
    }
}
//#endregion
//#region Control Point Mode
class ControlPointMode extends ObjectInspectorMode {
    controlPoints;
    currentObject;
    laceList;
    atFront = false;
    constructor() {
        const controls = new GroupControl();
        controls.add(new TextControl('<b>Click</b> on a control point to <b>select</b> it.'));
        controls.add(new TextControl('<b>Move</b> the selected control point with the transform controls.'));
        controls.add(new KeyControl('E/Insert', 'Insert a new control point at the last selected endpoint.'));
        controls.add(new KeyControl('R/Delete', 'Remove the last control point.'));
        controls.add(new TextControl('When a control point is selected, <b>scroll</b> to change its weight.'));
        super('waypoints', false, controls);
        this.controlPoints = [];
        this.currentObject = null;
        this.laceList = new ListElement("Control Points", this.controlPoints, this.listChanged.bind(this), this.listAdd.bind(this), this.listRemove.bind(this), { scrollFix: true });
        EventBus.subscribe('editHandleSelected', "all" /* EEnv.ALL */, (editHandle) => {
            if (!this.currentObject)
                return;
            if (editHandle.getIndex() === 0) {
                this.atFront = true;
            }
            else if (editHandle.getIndex() === this.controlPoints.length - 1) {
                this.atFront = false;
            }
            this.currentObject.showWeightEditRing(editHandle.getIndex());
        });
        EventBus.subscribe('editHandleUnselected', "all" /* EEnv.ALL */, () => {
            if (!this.currentObject)
                return;
            this.currentObject.hideWeightEditRing();
        });
        App.getInteractionsManager().addKeydowns(['e', 'insert'], (() => {
            if (!this.active)
                return;
            if (this.currentObject === null)
                return;
            const raycaster = new Raycaster();
            raycaster.setFromCamera(App.getSelectionManager().getMouse(), App.getCamera());
            const forward = new Vector3();
            App.getCamera().getWorldDirection(forward);
            const lastControlPoint = this.atFront ? this.controlPoints[0].getPosition() : this.controlPoints[this.controlPoints.length - 1].getPosition();
            const plane = new Plane().setFromNormalAndCoplanarPoint(forward, lastControlPoint);
            const intersection = new Vector3();
            raycaster.ray.intersectPlane(plane, intersection);
            intersection.x = Math.round(intersection.x * 100) / 100;
            intersection.y = Math.round(intersection.y * 100) / 100;
            intersection.z = Math.round(intersection.z * 100) / 100;
            this.addControlPoint(intersection.sub(this.currentObject.getPosition()), this.atFront);
        }).bind(this));
        App.getInteractionsManager().addKeydowns(['r', 'delete'], (() => {
            if (!this.active)
                return;
            if (this.currentObject === null)
                return;
            this.removeControlPoint(this.atFront);
        }).bind(this));
    }
    build(tab) {
        tab.add(this.laceList);
    }
    select(object) {
        this.atFront = false;
        this.currentObject = object;
    }
    deselect() {
        this.currentObject = null;
    }
    objectChanged(object) {
        const curveControlPoints = object.getControlPoints();
        this.controlPoints.length = 0;
        curveControlPoints.forEach((point, index) => {
            this.controlPoints.push(new UniformRationalBSplineControlPointLaceListElement(point));
        });
        this.laceList.update();
    }
    inspectorChanged(object) { }
    listChanged(index) {
        if (this.currentObject === null)
            return;
        const pos = this.controlPoints[index].getPosition();
        const point = new Vector4(pos.x, pos.y, pos.z, this.controlPoints[index].getWeight());
        this.currentObject.updateControlPoint(index, point);
    }
    listAdd() {
        if (this.currentObject === null)
            return;
        const preLast = this.controlPoints[this.controlPoints.length - 2].getPosition();
        const last = this.controlPoints[this.controlPoints.length - 1].getPosition();
        const newPosition = getNewPosition(last, preLast);
        this.addControlPoint(newPosition);
    }
    addControlPoint(position, atFront = false) {
        if (this.currentObject === null)
            return;
        App.getTransformControls().detach();
        App.getSelectionManager().doResetSelectedEditHandle();
        const point = new Vector4(position.x, position.y, position.z, 1);
        this.currentObject.addControlPoint(point, atFront);
        this.objectChanged(this.currentObject);
    }
    listRemove() {
        if (this.currentObject === null)
            return;
        this.removeControlPoint();
        this.objectChanged(this.currentObject);
    }
    removeControlPoint(atFront = false) {
        if (this.currentObject === null)
            return;
        App.getTransformControls().detach();
        App.getSelectionManager().doResetSelectedEditHandle();
        this.currentObject.removeControlPoint(atFront);
        this.objectChanged(this.currentObject);
    }
}
class UniformRationalBSplineControlPointLaceListElement extends LaceListElement {
    position;
    constructor(point) {
        super();
        this.position = point;
    }
    setPosition(position) {
        this.position.set(position.x, position.y, position.z, this.position.w);
    }
    getPosition() {
        const result = new Vector3();
        result.set(this.position.x, this.position.y, this.position.z);
        return result;
    }
    setWeight(weight) {
        this.position.set(this.position.x, this.position.y, this.position.z, weight);
    }
    getWeight() {
        const result = this.position.w;
        return result;
    }
    getEditor() {
        const positionElement = new Vec3Element("Position", this.position, 'x', 'y', 'z');
        const weightElement = new SliderElement("Weight", this.position, 'w', { min: 1, max: 10, step: 0.5 });
        return [positionElement, weightElement];
    }
}
//#endregion

export { UniformRationalBSplineInspector };
