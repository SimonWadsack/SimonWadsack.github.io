import { TextSelectElement, ColorElement } from 'lacery';
import { Color } from 'three';
import { DiffuseShadingModel } from '../../utils/shading/shadingModels/diffuseShadingModel.js';
import { getAvailableShadingModels } from '../../utils/shading/surfaceMaterial.js';
import { GroupControl } from '../controls.js';
import { ObjectInspectorMode } from '../inspectors/objectInspector.js';

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

export { ShadingMode };
