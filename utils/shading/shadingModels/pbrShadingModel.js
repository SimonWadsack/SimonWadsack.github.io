import { LabelElement } from 'lacery';
import { ShadingModel } from '../shadingModel.js';

class PBRShadingModel extends ShadingModel {
    constructor() {
        super();
        this.enviroment = true;
    }
    getName() {
        return "PBR";
    }
    getFragmentShader() {
        return pbrFragmentShader();
    }
    buildUI(group) {
        group.add(new LabelElement("Still work in progress!", { italic: true, bold: true, newLine: false }));
        group.add(new LabelElement("Currently only shows the enviroment map to illustrate environment mapping.", { block: true }));
    }
    toJSON() {
        return {};
    }
    fromJSON(json) {
    }
}
function pbrFragmentShader() {
    return /*glsl*/ `


        uniform sampler2D envMap;
        uniform float envMapIntensity;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUV;
        varying vec3 vViewPosition;
        varying mat3 vTBN;
        varying vec3 vWorldNormal;

        #include <common>
        #include <lights_pars_begin>

        void main() {
            vec3 envReflect = reflect(normalize(vPosition - cameraPosition), vWorldNormal);

            vec2 uv = vec2(atan(envReflect.z, envReflect.x) / (2.0 * PI) + 0.5, 
                   asin(envReflect.y) / PI + 0.5);
    
            vec3 envColor = texture2D(envMap, uv).rgb;

            envColor *= envMapIntensity;
            
            gl_FragColor = vec4(envColor, 1.0);
        }
    `;
}

export { PBRShadingModel };
