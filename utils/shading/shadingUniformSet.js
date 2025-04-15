class ShadingUniformSet {
    uniforms;
    constructor() {
        this.uniforms = new Map();
    }
    add(uniform) {
        const existingUniform = this.uniforms.get(uniform.getName());
        if (existingUniform) {
            if (existingUniform.getType() === uniform.getType()) {
                existingUniform.value = uniform.value;
                return;
            }
        }
        this.uniforms.set(uniform.getName(), uniform);
    }
    has(name) {
        return this.uniforms.has(name);
    }
    get(name) {
        return this.uniforms.get(name);
    }
    getAll() {
        return Array.from(this.uniforms.values());
    }
    mergeFrom(other) {
        other.getAll().forEach((uniform) => {
            this.add(uniform);
        });
    }
    getTHREEUniforms() {
        const threeUniforms = {};
        this.uniforms.forEach((uniform) => {
            threeUniforms[uniform.getName()] = { value: uniform.value };
        });
        return threeUniforms;
    }
}

export { ShadingUniformSet };
