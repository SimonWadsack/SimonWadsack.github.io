import { ShaderMaterial, DoubleSide } from 'three';
import { ShadingUniformSet } from './shadingUniformSet.js';
import { SimpleShadingModel } from './shadingModels/simpleShadingModel.js';
import { PhongShadingModel } from './shadingModels/phongShadingModel.js';
import { TextureShadingModel } from './shadingModels/textureShadingModel.js';

//TODO: Move to the shading model factory and add a decorator to add the shading model to the list of available shading models
function getAvailableShadingModels() {
    return {
        [SimpleShadingModel.name]: { name: "Simple", create: () => new SimpleShadingModel() },
        [PhongShadingModel.name]: { name: "Phong", create: () => new PhongShadingModel() },
        [TextureShadingModel.name]: { name: "Texture", create: () => new TextureShadingModel("") },
    };
}
class SurfaceMaterial {
    vertexShader;
    controlPoints;
    color;
    shadingModel;
    uniformSet;
    material;
    group = undefined;
    constructor(vertexShader, controlPoints, color, shadingModel) {
        this.vertexShader = vertexShader;
        this.controlPoints = controlPoints;
        this.color = color.clone();
        this.shadingModel = shadingModel;
        this.uniformSet = new ShadingUniformSet();
        this.uniformSet.mergeFrom(shadingModel.getUniforms());
        this.material = new ShaderMaterial({
            vertexShader: this.vertexShader,
            fragmentShader: this.shadingModel.getFragmentShader(),
            uniforms: this.getUniforms(),
            side: DoubleSide,
        });
    }
    update() {
        this.updateUniforms();
    }
    updateControlPoints() {
        this.material.uniforms.controlPointsTexture.value = this.controlPoints.getTexture();
        this.material.uniforms.controlPointsWidth.value = this.controlPoints.getWidth();
        this.material.uniforms.controlPointsHeight.value = this.controlPoints.getHeight();
        this.material.needsUpdate = true;
    }
    getMaterial() {
        return this.material;
    }
    setColor(color) {
        this.color.set(color);
        this.material.uniforms.color.value.set(color);
        this.material.needsUpdate = true;
    }
    setShadingModel(shadingModel) {
        this.shadingModel = shadingModel;
        this.uniformSet.mergeFrom(shadingModel.getUniforms());
        this.material.fragmentShader = shadingModel.getFragmentShader();
        this.updateUniforms();
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
    updateUniforms() {
        const newUniforms = this.getUniforms();
        for (const key in newUniforms) {
            if (this.material.uniforms[key]) {
                this.material.uniforms[key].value = newUniforms[key].value;
            }
            else {
                this.material.uniforms[key] = newUniforms[key];
            }
        }
        this.material.needsUpdate = true;
    }
    getUniforms() {
        const uniforms = this.shadingModel.getUniforms().getTHREEUniforms();
        uniforms['controlPointsTexture'] = { value: this.controlPoints.getTexture() };
        uniforms['controlPointsWidth'] = { value: this.controlPoints.getWidth() };
        uniforms['controlPointsHeight'] = { value: this.controlPoints.getHeight() };
        uniforms['color'] = { value: this.color };
        return uniforms;
    }
}

export { SurfaceMaterial, getAvailableShadingModels };
