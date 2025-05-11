import { ShaderMaterial, DoubleSide, UniformsLib } from 'three';
import { ShadingUniformSet } from './shadingUniformSet.js';
import { DiffuseShadingModel } from './shadingModels/diffuseShadingModel.js';
import { BlinnPhongShadingModel } from './shadingModels/blinnphongShadingModel.js';
import { PBRShadingModel } from './shadingModels/pbrShadingModel.js';
import { EventBus } from '../../core/events.js';
import { App } from '../../core/app.js';

//TODO: Move to the shading model factory and add a decorator to add the shading model to the list of available shading models
function getAvailableShadingModels() {
    return {
        [DiffuseShadingModel.name]: { name: "Diffuse", create: () => new DiffuseShadingModel() },
        [BlinnPhongShadingModel.name]: { name: "Blinn-Phong", create: () => new BlinnPhongShadingModel() },
        [PBRShadingModel.name]: { name: "PBR", create: () => new PBRShadingModel() },
    };
}
// TODO: Texture Saving with Dexie, Tiling for textures, Bundle File that contains textures
class SurfaceMaterial {
    vertexShader;
    controlPoints;
    color;
    shadingModel;
    uniformSet;
    material;
    group = undefined;
    constructor(vertexShader, controlPoints, color, shadingModel, customUniforms = {}) {
        this.vertexShader = vertexShader;
        this.controlPoints = controlPoints;
        this.color = color.clone();
        this.shadingModel = shadingModel;
        this.shadingModel.setUpdateCallback(this.updateUniforms.bind(this));
        this.uniformSet = new ShadingUniformSet();
        this.uniformSet.mergeFrom(shadingModel.getUniforms());
        this.material = new ShaderMaterial({
            vertexShader: this.vertexShader,
            fragmentShader: this.shadingModel.getFragmentShader(),
            uniforms: { ...this.getUniforms(), ...this.getEnviromentUniforms(), ...UniformsLib.common, ...UniformsLib.lights, ...customUniforms },
            side: DoubleSide,
            lights: true
        });
        EventBus.subscribe('enviromentChanged', "all" /* EEnv.ALL */, this.updateEnviroment.bind(this));
        EventBus.subscribe('enviromentIntensityChanged', "all" /* EEnv.ALL */, this.updateEnviromentIntensity.bind(this));
    }
    update() {
        this.updateUniforms();
    }
    updateControlPoints() {
        this.material.uniforms.controlPointsTexture.value = this.controlPoints.getTexture();
        this.material.uniforms.controlPointsWidth.value = this.controlPoints.getWidth();
        this.material.uniforms.controlPointsHeight.value = this.controlPoints.getHeight();
        //this.material.needsUpdate = true;
    }
    getMaterial() {
        return this.material;
    }
    setColor(color) {
        this.color.set(color);
        this.material.uniforms.color.value.set(color);
        //this.material.needsUpdate = true;
    }
    setShadingModel(shadingModel) {
        this.shadingModel.removeUpdateCallback();
        this.shadingModel.dispose();
        this.shadingModel = shadingModel;
        this.shadingModel.setUpdateCallback(this.updateUniforms.bind(this));
        this.uniformSet.mergeFrom(shadingModel.getUniforms());
        this.material.fragmentShader = shadingModel.getFragmentShader();
        this.updateUniforms();
        this.updateEnviroment();
        this.material.needsUpdate = true;
        if (this.group === undefined)
            return;
        this.group.reset();
        this.shadingModel.buildUI(this.group);
    }
    getShadingModelName() {
        return this.shadingModel.constructor.name;
    }
    getShadingModelJSON() {
        return this.shadingModel.toJSON();
    }
    buildUI(group) {
        this.group = group;
        this.group.onChange(this.updateUniforms.bind(this));
        this.shadingModel.buildUI(this.group);
    }
    setCustomUniform(name, value) {
        if (this.material.uniforms[name]) {
            this.material.uniforms[name].value = value;
        }
        else {
            this.material.uniforms[name] = { value: value };
        }
    }
    dispose() {
        this.shadingModel.removeUpdateCallback();
        this.shadingModel.dispose();
        this.material.dispose();
    }
    updateUniforms() {
        const newUniforms = this.getUniforms();
        for (const key in newUniforms) {
            if (this.material.uniforms[key] && this.material.uniforms[key].value !== newUniforms[key].value) {
                this.material.uniforms[key].value = newUniforms[key].value;
            }
            else {
                this.material.uniforms[key] = newUniforms[key];
            }
        }
        //this.material.needsUpdate = true;
    }
    updateEnviroment() {
        if (!this.shadingModel.enviroment)
            return;
        this.material.uniforms.envMap.value = App.getScene().environment;
        this.material.uniforms.envMapIntensity.value = App.getScene().environmentIntensity;
    }
    updateEnviromentIntensity() {
        if (!this.shadingModel.enviroment)
            return;
        this.material.uniforms.envMapIntensity.value = App.getScene().environmentIntensity;
    }
    getUniforms() {
        const uniforms = this.shadingModel.getUniforms().getTHREEUniforms();
        uniforms['controlPointsTexture'] = { value: this.controlPoints.getTexture() };
        uniforms['controlPointsWidth'] = { value: this.controlPoints.getWidth() };
        uniforms['controlPointsHeight'] = { value: this.controlPoints.getHeight() };
        uniforms['color'] = { value: this.color };
        return uniforms;
    }
    getEnviromentUniforms() {
        return {
            envMap: { value: null },
            envMapIntensity: { value: 1 },
        };
    }
}

export { SurfaceMaterial, getAvailableShadingModels };
