import { Vector3, Color, Raycaster, Plane } from 'three';
import { GroupControl, TextControl, KeyControl } from '../controls.js';
import { ObjectInspector, ObjectInspectorMode } from './objectInspector.js';
import { EventBus } from '../../core/events.js';
import { App } from '../../core/app.js';
import { SliderElement, TextElement, Vec3Element, ColorElement, TextSelectElement, LabelElement } from 'lacery';
import { DiffuseShadingModel } from '../../utils/shading/shadingModels/diffuseShadingModel.js';
import { getAvailableShadingModels } from '../../utils/shading/surfaceMaterial.js';

class UniformBSplineSurfaceInspector extends ObjectInspector {
    constructor(lace) {
        const modes = [new ObjectMode(), new ControlPointMode(), new ShadingMode()];
        super("Uniform B-Spline Surface", lace, modes);
    }
}
class ObjectMode extends ObjectInspectorMode {
    params;
    degreeSlider;
    constructor() {
        const controls = new GroupControl();
        controls.add(new TextControl('<b>Move</b> the object with the transform control.'));
        super('box', true, controls);
        this.params = { name: '', position: new Vector3(), color: "#000000", degree: 0, closed: "none" };
        this.degreeSlider = new SliderElement("Degree", this.params, 'degree', { min: 2, max: 10, step: 1 });
    }
    build(tab) {
        tab.add(new TextElement("", this.params, 'name'));
        tab.add(new Vec3Element("Position", this.params.position, 'x', 'y', 'z'));
        tab.add(new ColorElement("Color", this.params, 'color'));
        tab.add(this.degreeSlider);
        tab.add(new TextSelectElement("Closed", this.params, 'closed', { "none": "None", "u": "X", "v": "Y" }));
    }
    select(object) { }
    deselect() { }
    objectChanged(object) {
        this.params.name = object.getName();
        this.params.position.set(object.getPosition().x, object.getPosition().y, object.getPosition().z);
        this.params.color = object.getColor().getHexString();
        this.params.degree = object.getDegree();
        this.degreeSlider.setMax(object.getMaxDegree());
        this.params.closed = object.getClosedU() ? "u" : object.getClosedV() ? "v" : "none";
    }
    inspectorChanged(object) {
        if (!this.params.color.startsWith('#') && !this.params.color.startsWith('rgb'))
            this.params.color = '#' + this.params.color;
        object.setName(this.params.name);
        object.setPosition(this.params.position);
        object.updateColor(new Color(this.params.color));
        object.setDegree(this.params.degree);
        if (this.params.closed === "u") {
            object.setClosedU(true);
        }
        else if (this.params.closed === "v") {
            object.setClosedV(true);
        }
        else {
            object.setClosedU(false);
            object.setClosedV(false);
        }
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
        tab.add(new LabelElement("Control Points", { bold: true }));
        tab.add(new LabelElement("Work in progress!", { italic: true }));
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
        super('brick-wall', false, controls, true);
        this.currentObject = null;
        this.params = { shadingModel: DiffuseShadingModel.name, color: "#000000" };
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
        this.params.color = object.getColor().getHexString();
        this.params.shadingModel = object.getMaterial().getShadingModelName();
    }
    inspectorChanged(object) {
        if (!this.params.color.startsWith('#') && !this.params.color.startsWith('rgb'))
            this.params.color = '#' + this.params.color;
        object.updateColor(new Color(this.params.color));
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

export { UniformBSplineSurfaceInspector };
