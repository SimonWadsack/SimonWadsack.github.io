import { Color, Vector3, Raycaster, Plane } from 'three';
import { ObjectInspector, ObjectInspectorMode } from './objectInspector.js';
import { GroupControl, TextControl, KeyControl } from '../controls.js';
import { SliderElement } from '../../lacery/elements/sliderElement.js';
import { TextElement } from '../../lacery/elements/textElement.js';
import { ColorElement } from '../../lacery/elements/colorElement.js';
import { Vec3Element } from '../../lacery/elements/vec3Element.js';
import { ListElement, LaceListElement } from '../../lacery/elements/listElement.js';
import { App } from '../../core/app.js';
import { getNewPosition } from '../../core/vars.js';
import { EventBus } from '../../core/events.js';
import { LabelElement } from '../../lacery/elements/labelElement.js';

class BezierCurveInspector extends ObjectInspector {
    constructor(lace) {
        const modes = [new ObjectMode(), new ControlPointMode(), new DeCasteljauMode(), new InfoMode()];
        super("Bezier Curve", lace, modes);
    }
}
//#region Object Mode
class ObjectMode extends ObjectInspectorMode {
    params;
    constructor() {
        const controls = new GroupControl();
        controls.add(new TextControl('<b>Move</b> the object with the transform control.'));
        super('box', true, controls);
        this.params = { name: '', position: new Vector3(), color: new Color(0x000000) };
    }
    build(tab) {
        tab.add(new TextElement("", this.params, 'name'));
        tab.add(new Vec3Element("Position", this.params.position, 'x', 'y', 'z'));
        tab.add(new ColorElement("Color", this.params, 'color'));
    }
    select(object) { }
    deselect() { }
    objectChanged(object) {
        this.params.name = object.getName();
        this.params.position.set(object.getPosition().x, object.getPosition().y, object.getPosition().z);
        this.params.color.set(object.getColor());
    }
    inspectorChanged(object) {
        object.setName(this.params.name);
        object.setPosition(this.params.position);
        object.updateColor(this.params.color);
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
            this.controlPoints.push(new BezierCurveControlPointLaceListElement(point));
        });
        this.laceList.update();
    }
    inspectorChanged(object) { }
    listChanged(index) {
        if (this.currentObject === null)
            return;
        this.currentObject.updateControlPoint(index, this.controlPoints[index].getPosition());
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
        this.currentObject.addControlPoint(position, atFront);
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
class BezierCurveControlPointLaceListElement extends LaceListElement {
    position;
    constructor(position) {
        super();
        this.position = position;
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
//#endregion
//#region De Casteljau Mode
class DeCasteljauMode extends ObjectInspectorMode {
    params;
    currentObject;
    slider;
    constructor() {
        const controls = new GroupControl();
        controls.add(new TextControl('<b>Hover</b> over the curve to adjust the t-value.'));
        super('spline', false, controls, true);
        this.params = { t: 0 };
        this.currentObject = null;
        this.slider = new SliderElement("T", this.params, 't', { min: 0, max: 1, step: 0.01 });
        window.addEventListener('mousemove', ((event) => {
            if (!this.active)
                return;
            if (App.isOrbiting())
                return;
            if (this.currentObject === null)
                return;
            const raycaster = new Raycaster();
            raycaster.setFromCamera(App.getSelectionManager().getMouse(), App.getCamera());
            const intersection = raycaster.intersectObject(this.currentObject.getCollisionMesh(), false);
            if (intersection.length > 0) {
                const curvePoint = intersection[0].point.sub(this.currentObject.getPosition());
                this.currentObject.updateDeCasteljauFromNearestPoint(curvePoint);
                this.params.t = this.currentObject.getDeCasteljauT();
                this.slider.update();
            }
        }).bind(this));
    }
    build(tab) {
        tab.add(new LabelElement("De-Casteljau Visualization"));
        tab.add(this.slider);
    }
    select(object) {
        this.currentObject = object;
    }
    deselect() {
        this.currentObject = null;
    }
    objectChanged(object) {
        this.params.t = object.getDeCasteljauT();
    }
    inspectorChanged(object) {
        object.updateDeCasteljauT(this.params.t);
    }
}
//#endregion
//#region Info Mode
class InfoMode extends ObjectInspectorMode {
    constructor() {
        const controls = new GroupControl();
        super('info', false, controls, true);
    }
    build(tab) {
        tab.add(new LabelElement('A <b>Bezier Curve</b> \\( b(t) \\) is a parametric curve widely used in computer graphics, animation, and design for modeling smooth and scalable shapes.<br />' +
            'It is defined by a <b>set of control points</b> \\( b_i \\), which determine the curve\'s shape.' +
            'The curve starts at the first control point and ends at the last one, with intermediate control points influencing its curvature.<br/>' +
            '\\[ b(t) = \\sum_{i=0}^{n} \\binom{n}{i} \\, t^{i} \\, (1-t)^{n-i} \\, b_i \\]' +
            'Where \\( n \\) is the degree of the curve, \\( b_i \\) are the control points, and \\( t \\) varies from 0 to 1.', { block: true }));
    }
    select(object) { }
    deselect() { }
    objectChanged(object) { }
    inspectorChanged(object) { }
}
//#endregion

export { BezierCurveInspector };
