import { TextureElement } from 'lacery';
import { ShadingModel } from '../shadingModel.js';
import { BoolUniform, TextureUniform } from '../shadingUniform.js';

class DiffuseShadingModel extends ShadingModel {
    useMainTexture;
    mainTexture;
    mainElement;
    constructor() {
        super();
        this.useMainTexture = new BoolUniform("useMainTexture", false);
        this.mainTexture = new TextureUniform("mainTexture", null);
        this.uniforms.add(this.useMainTexture);
        this.uniforms.add(this.mainTexture);
        const mainElement = new TextureElement('Texture', this.mainTexture, 'blob');
        mainElement.onChange(() => {
            this.useMainTexture.value = mainElement.hasTexture();
            this.mainTexture.update();
        });
        this.mainElement = mainElement;
    }
    getName() {
        return "Diffuse";
    }
    getFragmentShader() {
        return diffuseFragmentShader();
    }
    buildUI(group) {
        group.add(this.mainElement);
    }
    toJSON() { return {}; }
    fromJSON(json) { }
    dispose() {
        this.mainTexture.blob = null;
        this.mainTexture.update();
        this.mainElement.updateBlob();
    }
}
function diffuseFragmentShader() {
    return /*glsl*/ `
        uniform bool useMainTexture;
        uniform sampler2D mainTexture;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUV;
        varying vec3 vViewPosition;
        varying mat3 vTBN;

        #include <common>
        #include <lights_pars_begin>
    
        void main(){
            // Get the base color
            vec3 color = useMainTexture ? texture2D(mainTexture, vUV).rgb : vColor;

            // Calculate the normal
            vec3 normal = normalize(vNormal);

            // Calculate the light direction
            vec3 lightDir = directionalLights[0].direction;

            // Calculate the diffuse part
            float diff = max(dot(lightDir, normal), 0.0);

            // Calculate the components
            vec3 lightColor = directionalLights[0].color;
            vec3 ambient = ambientLightColor;
            vec3 diffuse = diff * lightColor;

            vec3 finalColor = (ambient + diffuse) * color;

            // Final output
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
}

export { DiffuseShadingModel };
