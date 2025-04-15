import { App } from '../../../core/app.js';
import { ShadingModel } from '../shadingModel.js';
import { Vec3Uniform } from '../shadingUniform.js';

class SimpleShadingModel extends ShadingModel {
    lightDirection;
    constructor() {
        super();
        this.lightDirection = new Vec3Uniform("lightDirection", App.getDirectionalLight().position.clone());
        this.uniforms.add(this.lightDirection);
    }
    getName() {
        return "Simple";
    }
    getFragmentShader() {
        return simpleFragmentShader();
    }
    buildUI(group) { }
    toJSON() { return {}; }
    fromJSON(json) { }
}
function simpleFragmentShader() {
    return /*glsl*/ `
        uniform vec3 lightDirection;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
    
        void main(){
            vec3 norm = normalize(vNormal);
            vec3 lightDir = normalize(-lightDirection);
            float light = max(dot(norm, lightDir), 0.0);
            vec3 color = vColor * light;
            gl_FragColor = vec4(color, 1.0);
        }
    `;
}

export { SimpleShadingModel };
