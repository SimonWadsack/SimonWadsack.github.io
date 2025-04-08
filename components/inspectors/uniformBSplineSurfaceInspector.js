import { Color, Vector3, Raycaster, Plane } from 'three';
import { TextElement } from '../../lacery/elements/textElement.js';
import { ColorElement } from '../../lacery/elements/colorElement.js';
import { Vec3Element } from '../../lacery/elements/vec3Element.js';
import { GroupControl, TextControl, KeyControl } from '../controls.js';
import { ObjectInspector, ObjectInspectorMode } from './objectInspector.js';
import { LabelElement } from '../../lacery/elements/labelElement.js';
import { EventBus } from '../../core/events.js';
import { App } from '../../core/app.js';

class UniformBSplineSurfaceInspector extends ObjectInspector {
    constructor(lace) {
        const modes = [new ObjectMode(), new ControlPointMode()];
        super("Uniform B-Spline Surface", lace, modes);
    }
}
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
class ControlPointMode extends ObjectInspectorMode {
    currentObject;
    lastIndex = null;
    constructor() {
        const controls = new GroupControl();
        controls.add(new TextControl('<b>Click</b> on a control point to <b>select</b> it.'));
        controls.add(new TextControl('<b>Move</b> the selected control point with the transform controls.'));
        controls.add(new TextControl('<b>Once you have selected a control point</b> (at the edges):'));
        controls.add(new KeyControl('E/Insert', 'Insert a new row and/or column at the mouse position.'));
        controls.add(new KeyControl('R/Delete', 'Remove the last row and/or column.'));
        //controls.add(new KeyControl('E/Insert', 'Insert a new control point at the last selected endpoint.'));
        //controls.add(new KeyControl('R/Delete', 'Remove the last control point.'));
        super('waypoints', false, controls);
        this.currentObject = null;
        EventBus.subscribe('editHandleSelected', "all" /* EEnv.ALL */, (editHandle) => {
            if (!this.currentObject)
                return;
            this.lastIndex = editHandle.getIndex();
        });
        EventBus.subscribe('editHandleUnselected', "all" /* EEnv.ALL */, () => {
            this.lastIndex = null;
        });
        App.getInteractionsManager().addKeydowns(['e', 'insert'], (() => {
            if (!this.active)
                return;
            if (this.currentObject === null)
                return;
            if (this.lastIndex === null)
                return;
            const raycaster = new Raycaster();
            raycaster.setFromCamera(App.getSelectionManager().getMouse(), App.getCamera());
            const forward = new Vector3();
            App.getCamera().getWorldDirection(forward);
            const lastControlPoint = this.currentObject.getControlPoint(this.lastIndex);
            const plane = new Plane().setFromNormalAndCoplanarPoint(forward, lastControlPoint);
            const intersection = new Vector3();
            raycaster.ray.intersectPlane(plane, intersection);
            intersection.x = Math.round(intersection.x * 100) / 100;
            intersection.y = Math.round(intersection.y * 100) / 100;
            intersection.z = Math.round(intersection.z * 100) / 100;
            this.addControlPoint(this.lastIndex, intersection);
        }).bind(this));
        App.getInteractionsManager().addKeydowns(['r', 'delete'], (() => {
            if (!this.active)
                return;
            if (this.currentObject === null)
                return;
            if (this.lastIndex === null)
                return;
            this.removeControlPoint(this.lastIndex);
        }).bind(this));
    }
    build(tab) {
        //TODO: build better list that can accomodate adding controlpoints at the start
        //tab.add(this.laceList);
        tab.add(new LabelElement("WORK IN PROGRESS"));
    }
    select(object) {
        this.currentObject = object;
    }
    deselect() {
        this.currentObject = null;
    }
    objectChanged(object) {
    }
    inspectorChanged(object) {
    }
    addControlPoint(index, position) {
        if (!this.currentObject)
            return;
        App.getTransformControls().detach();
        App.getSelectionManager().doResetSelectedEditHandle();
        this.currentObject.addControlPoint(index, position);
        this.objectChanged(this.currentObject);
    }
    removeControlPoint(index) {
        if (this.currentObject === null)
            return;
        App.getTransformControls().detach();
        App.getSelectionManager().doResetSelectedEditHandle();
        this.currentObject.removeControlPoint(index);
        this.objectChanged(this.currentObject);
    }
}

export { UniformBSplineSurfaceInspector };
