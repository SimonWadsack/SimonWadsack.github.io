import { LabelElement, SliderElement, ColorElement, SeperatorElement, TextSelectElement, BooleanElement } from 'lacery';
import { ObjectInspector, ObjectInspectorMode } from './objectInspector.js';
import { GroupControl } from '../controls.js';
import { App } from '../../core/app.js';
import { EXRLoader } from 'three/examples/jsm/Addons.js';
import { EquirectangularReflectionMapping, NearestFilter, Color } from 'three';
import { getModeBackgroundColor } from '../../core/vars.js';
import { EventBus } from '../../core/events.js';

class SceneInspector extends ObjectInspector {
    constructor(lace) {
        const modes = [new LightsMode(), new EnviromentMode(), new SettingsMode()];
        super("Scene", lace, modes);
    }
}
//#region Object Mode
class LightsMode extends ObjectInspectorMode {
    dirParams;
    ambParams;
    constructor() {
        const controls = new GroupControl();
        super('sun', false, controls, true);
        this.dirParams = { dirLightRotation: 0, dirLightIntensity: 1, dirLightColor: "#ffffff" };
        this.ambParams = { ambLightIntensity: 0.2, ambLightColor: "#f0f0f0" };
    }
    build(tab) {
        tab.add(new LabelElement("Directional Light", { bold: true }));
        tab.add(new SliderElement("Rotation", this.dirParams, "dirLightRotation", { min: 0, max: 360, step: 1 }).onChange(this.updateDirectionalLight.bind(this)));
        tab.add(new SliderElement("Intensity", this.dirParams, "dirLightIntensity", { min: 0.5, max: 3, step: 0.1 }).onChange(this.updateDirectionalLight.bind(this)));
        tab.add(new ColorElement("Color", this.dirParams, "dirLightColor").onChange(this.updateDirectionalLight.bind(this)));
        tab.add(new SeperatorElement());
        tab.add(new LabelElement("Ambient Light", { bold: true }));
        tab.add(new SliderElement("Intensity", this.ambParams, "ambLightIntensity", { min: 0, max: 1, step: 0.1 }).onChange(this.updateAmbientLight.bind(this)));
        tab.add(new ColorElement("Color", this.ambParams, "ambLightColor").onChange(this.updateAmbientLight.bind(this)));
    }
    updateDirectionalLight() {
        const radius = 15;
        const angle = (Math.PI / 180) * this.dirParams.dirLightRotation;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        App.getDirectionalLight().position.set(x, 20, z);
        App.getDirectionalLight().intensity = this.dirParams.dirLightIntensity;
        App.getDirectionalLight().color.set(this.dirParams.dirLightColor);
    }
    updateAmbientLight() {
        App.getAmbientLight().intensity = this.ambParams.ambLightIntensity;
        App.getAmbientLight().color.set(this.ambParams.ambLightColor);
    }
    select(object) { }
    deselect() { }
    objectChanged(object) { }
    inspectorChanged(object) { }
}
//#endregion
//#region EnviromentMode
class EnviromentMode extends ObjectInspectorMode {
    params;
    exrLoader;
    constructor() {
        const controls = new GroupControl();
        super('tent-tree', false, controls, true);
        this.params = { exrName: "outdoor", exrIntensity: 1, showBackground: false };
        this.exrLoader = new EXRLoader();
    }
    build(tab) {
        tab.add(new LabelElement("Scene Enviroment", { bold: true }));
        tab.add(new TextSelectElement("Map", this.params, 'exrName', { 'outdoor': 'Outdoor', 'indoor': 'Indoor', 'space': 'Space', 'northernLights': 'Northern Lights' }).onChange(this.updateEnviroment.bind(this)));
        tab.add(new SliderElement("Intensity", this.params, "exrIntensity", { min: 0, max: 5, step: 0.1 }).onChange(this.updateEnviromentIntensity.bind(this)));
        tab.add(new BooleanElement("Show Background", this.params, "showBackground").onChange(this.updateBackground.bind(this)));
    }
    updateEnviroment() {
        this.exrLoader.load(`/exrs/${this.params.exrName}.exr`, (texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            texture.minFilter = texture.magFilter = NearestFilter;
            texture.flipY = false;
            App.getScene().environment = texture;
            App.getScene().environmentIntensity = this.params.exrIntensity;
            if (this.params.showBackground) {
                App.getScene().background = texture;
                App.getScene().backgroundIntensity = this.params.exrIntensity;
            }
            else {
                App.getScene().background = new Color(getModeBackgroundColor());
                App.getScene().backgroundIntensity = 1;
            }
            texture.dispose();
            EventBus.notify('enviromentChanged', "all" /* EEnv.ALL */);
        });
    }
    updateEnviromentIntensity() {
        App.getScene().environmentIntensity = this.params.exrIntensity;
        if (this.params.showBackground) {
            App.getScene().backgroundIntensity = this.params.exrIntensity;
        }
        EventBus.notify('enviromentIntensityChanged', "all" /* EEnv.ALL */);
    }
    updateBackground() {
        if (this.params.showBackground) {
            App.getScene().background = App.getScene().environment;
            App.getScene().backgroundIntensity = this.params.exrIntensity;
        }
        else {
            App.getScene().background = new Color(getModeBackgroundColor());
            App.getScene().backgroundIntensity = 1;
        }
    }
    select(object) {
        if (App.getScene().environment === null)
            this.updateEnviroment();
    }
    deselect() { }
    objectChanged(object) { }
    inspectorChanged(object) { }
}
//#endregion
//#region SettingsMode
class SettingsMode extends ObjectInspectorMode {
    constructor() {
        const controls = new GroupControl();
        super('cog', false, controls, true);
    }
    build(tab) {
        tab.add(new LabelElement("General Settings", { bold: true }));
        tab.add(new LabelElement("Work in progress!", { italic: true }));
    }
    select(object) { }
    deselect() { }
    objectChanged(object) { }
    inspectorChanged(object) { }
}
//#endregion

export { SceneInspector };
