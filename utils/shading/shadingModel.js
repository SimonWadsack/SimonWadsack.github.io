import { ShadingUniformSet } from './shadingUniformSet.js';

class ShadingModel {
    uniforms;
    constructor() {
        this.uniforms = new ShadingUniformSet();
    }
    getUniforms() {
        return this.uniforms;
    }
}

export { ShadingModel };
