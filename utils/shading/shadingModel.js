import { ShadingUniformSet } from './shadingUniformSet.js';

class ShadingModel {
    uniforms;
    enviroment;
    updateCallback = undefined;
    constructor() {
        this.uniforms = new ShadingUniformSet();
        this.enviroment = false;
    }
    getUniforms() {
        return this.uniforms;
    }
    setUpdateCallback(callback) {
        this.updateCallback = callback;
    }
    removeUpdateCallback() {
        this.updateCallback = undefined;
    }
}

export { ShadingModel };
