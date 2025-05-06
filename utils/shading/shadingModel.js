import { ShadingUniformSet } from './shadingUniformSet.js';

class ShadingModel {
    uniforms;
    enviroment;
    constructor() {
        this.uniforms = new ShadingUniformSet();
        this.enviroment = false;
    }
    getUniforms() {
        return this.uniforms;
    }
}

export { ShadingModel };
