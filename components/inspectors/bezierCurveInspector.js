import { Raycaster, Vector3, Plane, Color } from 'three';
import { TextElement } from '../../lacery/elements/textElement.js';
import { ColorElement } from '../../lacery/elements/colorElement.js';
import { Vec3Element } from '../../lacery/elements/vec3Element.js';
import { ListElement, LaceListElement } from '../../lacery/elements/listElement.js';
import { EventBus } from '../../core/events.js';

class BezierCurveInspectorParams {
    name;
    position;
    color;
    controlPoints;
    constructor() {
        this.name = "";
        this.position = new Vector3(0, 0, 0);
        this.color = new Color(0x000000);
        this.controlPoints = [];
    }
}
class BezierCurveInspector {
    lace;
    group;
    params;
    currentObject;
    selectionManager;
    raycaster = new Raycaster();
    constructor(lace, selectionManager) {
        this.lace = lace;
        this.params = new BezierCurveInspectorParams();
        this.currentObject = null;
        this.selectionManager = selectionManager;
        this.group = this.lace.addGroup();
        this.group.add(new TextElement("", this.params, 'name'));
        this.group.add(new Vec3Element("Position", this.params.position, 'x', 'y', 'z'));
        this.group.add(new ColorElement("Color", this.params, 'color'));
        this.group.add(new ListElement("Control Points", this.params.controlPoints, this.listChanged.bind(this), this.listAdd.bind(this), this.listRemove.bind(this)));
        this.group.onChange(() => this.inspectorChanged());
        this.lace.hide(this.group);
        window.addEventListener('keyup', (event) => {
            if (!this.currentObject)
                return;
            if (!this.selectionManager.isActive())
                return;
            if (event.key === 'Delete' || event.key === 'r') {
                this.listRemove();
            }
            else if (event.key === 'Insert' || event.key === 'e') {
                this.raycaster.setFromCamera(this.selectionManager.getMouse(), this.selectionManager.getCamera());
                const forward = new Vector3();
                this.selectionManager.getCamera().getWorldDirection(forward);
                const lastControlPoint = this.params.controlPoints[this.params.controlPoints.length - 1].getPosition();
                const plane = new Plane().setFromNormalAndCoplanarPoint(forward, lastControlPoint);
                const intersection = new Vector3();
                this.raycaster.ray.intersectPlane(plane, intersection);
                intersection.x = Math.round(intersection.x * 100) / 100;
                intersection.y = Math.round(intersection.y * 100) / 100;
                intersection.z = Math.round(intersection.z * 100) / 100;
                this.addControlPoint(intersection);
            }
        });
    }
    select(object) {
        this.lace.hideAll();
        this.currentObject = object;
        this.objectChanged();
        this.lace.show(this.group);
    }
    deselect() {
        this.lace.hide(this.group);
        this.currentObject = null;
    }
    objectChanged() {
        if (!this.currentObject)
            return;
        const position = this.currentObject.getPosition();
        const color = this.currentObject.getColor();
        const controlPoints = this.currentObject.getControlPoints();
        if (!position || !color || !controlPoints) {
            console.error("BezierCurveInspector:update failed");
            return;
        }
        this.params.name = this.currentObject.getName();
        this.params.position.set(position.x, position.y, position.z);
        this.params.color.set(color);
        this.params.controlPoints.length = 0;
        controlPoints.forEach((controlPoint) => {
            this.params.controlPoints.push(new BezierCurveControlPointLaceListElement(controlPoint));
        });
        this.group.update();
    }
    inspectorChanged() {
        if (!this.currentObject)
            return;
        this.currentObject.setName(this.params.name);
        this.currentObject.setPosition(this.params.position);
        this.currentObject.updateColor(this.params.color);
        EventBus.notify('objectNameChanged');
    }
    listChanged(index) {
        if (!this.currentObject)
            return;
        const controlPoint = this.params.controlPoints[index].getPosition();
        this.currentObject.updateControlPoint(index, controlPoint);
    }
    listAdd() {
        if (!this.currentObject)
            return;
        const preLast = this.params.controlPoints[this.params.controlPoints.length - 2].getPosition();
        const last = this.params.controlPoints[this.params.controlPoints.length - 1].getPosition();
        const newPosition = this.getNewPosition(last, preLast);
        this.addControlPoint(newPosition);
    }
    addControlPoint(position) {
        if (!this.currentObject)
            return;
        this.currentObject.addControlPoint(position);
        this.objectChanged();
    }
    listRemove() {
        if (!this.currentObject)
            return;
        this.selectionManager.getTransformControls().detach();
        this.currentObject.removeControlPoint(this.params.controlPoints.length - 1);
        this.objectChanged();
    }
    getNewPosition(a, b) {
        var result = new Vector3();
        result.set(a.x + (a.x - b.x), a.y - (a.y - b.y), a.z + (a.z - b.z));
        return result;
    }
}
class BezierCurveControlPointLaceListElement extends LaceListElement {
    position = new Vector3(0, 0, 0);
    constructor(position) {
        super();
        this.position.set(position.x, position.y, position.z);
    }
    setPosition(position) {
        this.position.set(position.x, position.y, position.z);
    }
    getPosition() {
        const result = new Vector3();
        result.set(this.position.x, this.position.y, this.position.z);
        return result;
    }
    getEditor() {
        const positionElement = new Vec3Element("Position", this.position, 'x', 'y', 'z');
        return [positionElement];
    }
}

export { BezierCurveInspector };
