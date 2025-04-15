import { Color, Vector3, Raycaster, Plane } from 'three';
import { TextElement } from '../../lacery/elements/textElement.js';
import { TextSelectElement } from '../../lacery/elements/textSelectElement.js';
import { ColorElement } from '../../lacery/elements/colorElement.js';
import { Vec3Element } from '../../lacery/elements/vec3Element.js';
import { GroupControl, TextControl, KeyControl } from '../controls.js';
import { ObjectInspector, ObjectInspectorMode } from './objectInspector.js';
import { LabelElement } from '../../lacery/elements/labelElement.js';
import { EventBus } from '../../core/events.js';
import { App } from '../../core/app.js';
import { getAvailableShadingModels } from '../../utils/shading/surfaceMaterial.js';
import { SimpleShadingModel } from '../../utils/shading/shadingModels/simpleShadingModel.js';

class BezierPatchInspector extends ObjectInspector {
    constructor(lace) {
        const modes = [new ObjectMode(), new ControlPointMode(), new ShadingMode()];
        super("Bezier Patch", lace, modes);
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
class ShadingMode extends ObjectInspectorMode {
    currentObject;
    group = undefined;
    params;
    constructor() {
        const controls = new GroupControl();
        super('brick-wall', false, controls, false);
        this.currentObject = null;
        this.params = { shadingModel: SimpleShadingModel.name, color: new Color(0x000000) };
    }
    build(tab) {
        tab.add(new TextSelectElement('Shading Model', this.params, 'shadingModel', this.getShadingModelsDropdown()));
        tab.add(new ColorElement("Color", this.params, 'color'));
        this.group = tab.addGroup();
        if (this.currentObject === null)
            return;
        this.currentObject.getMaterial().buildUI(this.group);
    }
    select(object) {
        this.currentObject = object;
        if (this.group === undefined)
            return;
        this.group.reset();
        this.currentObject.getMaterial().buildUI(this.group);
    }
    deselect() {
        this.currentObject = null;
    }
    objectChanged(object) {
        this.params.color.set(object.getColor());
        this.params.shadingModel = object.getMaterial().getShadingModelName();
    }
    inspectorChanged(object) {
        object.updateColor(this.params.color);
        const currentShadingModel = object.getMaterial().getShadingModelName();
        if (currentShadingModel !== this.params.shadingModel) {
            const shadingModel = this.createShadingModel(this.params.shadingModel);
            object.getMaterial().setShadingModel(shadingModel);
        }
    }
    //TODO: move to a shading model factory
    createShadingModel(name) {
        const shadingModels = getAvailableShadingModels();
        const shadingModel = shadingModels[name].create();
        return shadingModel;
    }
    getShadingModelsDropdown() {
        const availableShadingModels = getAvailableShadingModels();
        const shadingModels = {};
        for (const key in availableShadingModels) {
            shadingModels[key] = availableShadingModels[key].name;
        }
        return shadingModels;
    }
}

export { BezierPatchInspector };
