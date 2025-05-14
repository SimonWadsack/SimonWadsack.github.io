import { TextureElement, Vec2Element } from 'lacery';
import { ShadingModel } from '../shadingModel.js';
import { Vec2Uniform, BoolUniform, TextureUniform } from '../shadingUniform.js';
import { Vector2 } from 'three';

class DiffuseShadingModel extends ShadingModel {
    tiling;
    useMainTexture;
    mainTexture;
    mainElement;
    constructor() {
        super();
        this.tiling = new Vec2Uniform("tiling", new Vector2(1, 1));
        this.useMainTexture = new BoolUniform("useMainTexture", false);
        this.mainTexture = new TextureUniform("mainTexture", null);
        this.uniforms.add(this.tiling);
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
        const tilingElement = new Vec2Element('Tiling', this.tiling.value, 'x', 'y', { xStep: 0.1, yStep: 0.1 });
        group.add(tilingElement.onChange(() => {
            if (this.tiling.value.x < 0.1)
                this.tiling.value.x = 0.1;
            if (this.tiling.value.y < 0.1)
                this.tiling.value.y = 0.1;
            tilingElement.update();
        }));
        group.add(this.mainElement);
    }
    toJSON() {
        return {
            tiling: [this.tiling.value.x, this.tiling.value.y]
        };
    }
    fromJSON(json) {
        this.tiling.value.x = json.tiling[0];
        this.tiling.value.y = json.tiling[1];
    }
    dispose() {
        this.mainTexture.blob = null;
        this.mainTexture.update();
        this.mainElement.updateBlob();
    }
}
function diffuseFragmentShader() {
    return /*glsl*/ `
        uniform vec2 tiling;

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
            // Get the tilied UV
            vec2 uv = vUV * tiling;

            // Get the base color
            vec3 color = useMainTexture ? texture2D(mainTexture, uv).rgb : vColor;

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
