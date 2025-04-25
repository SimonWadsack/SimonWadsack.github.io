import { App } from '../../../core/app.js';
import { TextureElement } from 'lacery';
import { ShadingModel } from '../shadingModel.js';
import { TextureUniform, Vec3Uniform } from '../shadingUniform.js';

class TextureShadingModel extends ShadingModel {
    texture;
    lightDirection;
    constructor(texture = "") {
        super();
        this.texture = new TextureUniform("mainTexture", texture);
        this.lightDirection = new Vec3Uniform("lightDirection", App.getDirectionalLight().position.clone());
        this.uniforms.add(this.lightDirection);
        this.uniforms.add(this.texture);
    }
    getName() {
        return "Texture";
    }
    getFragmentShader() {
        return textureFragmentShader();
    }
    buildUI(group) {
        const textureElement = new TextureElement('Texture', this.texture, 'dataURL');
        textureElement.onChange(this.texture.update.bind(this.texture));
        group.add(textureElement);
    }
    toJSON() {
        return {
            texture: this.texture.dataURL
        };
    }
    fromJSON(json) {
        this.texture.dataURL = json.texture;
        this.texture.update();
    }
}
function textureFragmentShader() {
    return /*glsl*/ `
        uniform sampler2D mainTexture;
        uniform vec3 lightDirection;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUV;
    
        void main(){
            vec3 norm = normalize(vNormal);
            vec3 lightDir = normalize(-lightDirection);
            float light = max(dot(norm, lightDir), 0.0);
            
            vec4 texColor = texture2D(mainTexture, vUV);
            bool hasTexture = texColor.a > 0.0; // Check if texture has alpha > 0
            vec3 baseColor = hasTexture ? texColor.rgb : vColor;  // Fallback to vColor if no texture
            
            vec3 color = baseColor * light;
            gl_FragColor = vec4(color, 1.0);
        }
    `;
}

export { TextureShadingModel };
