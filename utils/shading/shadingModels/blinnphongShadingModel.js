import { fetchTexture } from '../../../core/app.js';
import { TextureElement, ButtonSelectElement, SliderElement } from 'lacery';
import { ShadingModel } from '../shadingModel.js';
import { BoolUniform, TextureUniform, FloatUniform } from '../shadingUniform.js';

class BlinnPhongShadingModel extends ShadingModel {
    useMainTexture;
    mainTexture;
    useRoughnessMap;
    roughnessMap;
    shininess;
    useNormalMap;
    normalMap;
    normalStrength;
    useAOMap;
    aoMap;
    mainElement;
    roughnessElement;
    normalElement;
    aoElement;
    constructor() {
        super();
        this.useMainTexture = new BoolUniform("useMainTexture", false);
        this.mainTexture = new TextureUniform("mainTexture", null);
        this.useRoughnessMap = new BoolUniform("useRoughnessMap", false);
        this.roughnessMap = new TextureUniform("roughnessMap", null);
        this.shininess = new FloatUniform("shininess", 0.5);
        this.useNormalMap = new BoolUniform("useNormalMap", false);
        this.normalMap = new TextureUniform("normalMap", null);
        this.normalStrength = new FloatUniform("normalStrength", 1.0);
        this.useAOMap = new BoolUniform("useAOMap", false);
        this.aoMap = new TextureUniform("aoMap", null);
        this.uniforms.add(this.useMainTexture);
        this.uniforms.add(this.mainTexture);
        this.uniforms.add(this.roughnessMap);
        this.uniforms.add(this.useRoughnessMap);
        this.uniforms.add(this.shininess);
        this.uniforms.add(this.useNormalMap);
        this.uniforms.add(this.normalMap);
        this.uniforms.add(this.normalStrength);
        this.uniforms.add(this.useAOMap);
        this.uniforms.add(this.aoMap);
        const mainElement = new TextureElement('Albedo', this.mainTexture, 'blob');
        mainElement.onChange(() => {
            this.useMainTexture.value = mainElement.hasTexture();
            this.mainTexture.update();
        });
        this.mainElement = mainElement;
        const roughnessElement = new TextureElement('Roughness', this.roughnessMap, 'blob');
        roughnessElement.onChange(() => {
            this.useRoughnessMap.value = roughnessElement.hasTexture();
            this.roughnessMap.update();
        });
        this.roughnessElement = roughnessElement;
        const normalElement = new TextureElement('Normal', this.normalMap, 'blob');
        normalElement.onChange(() => {
            this.useNormalMap.value = normalElement.hasTexture();
            this.normalMap.update();
        });
        this.normalElement = normalElement;
        const aoElement = new TextureElement('Ambient Occlusion', this.aoMap, 'blob');
        aoElement.onChange(() => {
            this.useAOMap.value = aoElement.hasTexture();
            this.aoMap.update();
        });
        this.aoElement = aoElement;
    }
    getName() {
        return "Blinn-Phong";
    }
    getFragmentShader() {
        return blinnPhongFragmentShader();
    }
    buildUI(group) {
        group.add(new ButtonSelectElement('Load a preset...', { 'rock': 'Rock', 'mossyrock': 'Mossy Rock', 'bark': 'Bark', 'onyx': 'Onyx' }, this.presetSelect.bind(this), { previews: ['textures/rock/albedo.jpg', 'textures/mossyrock/albedo.jpg', 'textures/bark/albedo.jpg', 'textures/onyx/albedo.jpg'], previewSize: 64 }));
        group.add(this.mainElement);
        group.add(this.roughnessElement);
        group.add(new SliderElement('Shininess', this.shininess, 'value', { min: 0.01, max: 1.0, step: 0.01 }));
        group.add(this.normalElement);
        group.add(new SliderElement('Normal Strength', this.normalStrength, 'value', { min: 0.0, max: 1.0, step: 0.01 }));
        group.add(this.aoElement);
    }
    toJSON() {
        return {
            shininess: this.shininess.value,
            normalStrength: this.normalStrength.value,
        };
    }
    fromJSON(json) {
        this.shininess.value = json.shininess;
        this.normalStrength.value = json.normalStrength;
    }
    dispose() {
        this.mainTexture.blob = null;
        this.mainTexture.update();
        this.roughnessMap.blob = null;
        this.roughnessMap.update();
        this.normalMap.blob = null;
        this.normalMap.update();
        this.aoMap.blob = null;
        this.aoMap.update();
        this.mainElement.updateBlob();
        this.roughnessElement.updateBlob();
        this.normalElement.updateBlob();
        this.aoElement.updateBlob();
    }
    async presetSelect(folder) {
        const fileNames = {
            albedo: 'albedo.jpg',
            ambientocclusion: 'ao.jpg',
            //displacement: 'displacement.jpg',
            normal: 'normal.jpg',
            roughness: 'roughness.jpg',
        };
        try {
            const [albedo, ao, normal, roughness] = await Promise.all([
                fetchTexture(folder, fileNames.albedo),
                fetchTexture(folder, fileNames.ambientocclusion),
                //fetchTexture(folder, fileNames.displacement),
                fetchTexture(folder, fileNames.normal),
                fetchTexture(folder, fileNames.roughness),
            ]);
            this.mainTexture.blob = albedo;
            this.useMainTexture.value = true;
            this.mainTexture.update();
            this.roughnessMap.blob = roughness;
            this.useRoughnessMap.value = true;
            this.roughnessMap.update();
            this.normalMap.blob = normal;
            this.useNormalMap.value = true;
            this.normalMap.update();
            this.aoMap.blob = ao;
            this.useAOMap.value = true;
            this.aoMap.update();
            this.mainElement.updateBlob();
            this.roughnessElement.updateBlob();
            this.normalElement.updateBlob();
            this.aoElement.updateBlob();
            this.updateCallback?.();
        }
        catch (e) {
            console.error("Error loading textures", e);
            return;
        }
    }
}
function blinnPhongFragmentShader() {
    return /*glsl*/ `
        uniform bool useMainTexture;
        uniform sampler2D mainTexture;
        
        uniform bool useRoughnessMap;
        uniform sampler2D roughnessMap;
        uniform float shininess;
        
        uniform bool useNormalMap;
        uniform sampler2D normalMap;
        uniform float normalStrength;

        uniform bool useAOMap;
        uniform sampler2D aoMap;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUV;
        varying vec3 vViewPosition;
        varying mat3 vTBN;
        varying vec3 vWorldNormal;

        #include <common>
        #include <lights_pars_begin>
    
        void main(){
            // Get the base color
            vec3 albedo = useMainTexture ? texture2D(mainTexture, vUV).rgb : vColor;

            // Get the normal (one minus as a weird fix beacause the vertex shader flips the sides)
            vec3 normal = normalize(vNormal);
            if(useNormalMap){
                vec3 tangentNormal = texture2D(normalMap, vUV).xyz * 2.0 - 1.0;
                float nrmStrength = normalStrength;
                vec3 worldNormal = normalize(vTBN * tangentNormal);
                normal = normalize(mix(normal, worldNormal, nrmStrength));
            }

            // Calculate the ambient occlusion
            float ao = useAOMap ? texture2D(aoMap, vUV).r : 1.0;

            // Calculate the light direction
            vec3 lightDir = directionalLights[0].direction;

            // Calculate the view direction
            vec3 viewDir = normalize(vViewPosition);

            // Calculate the half vector
            vec3 halfDir = normalize(lightDir + viewDir);

            // Calculate the diffuse part
            float diff = max(dot(lightDir, normal), 0.0);

            // Calculate the specular part
            float spec = pow(max(dot(halfDir, normal), 0.0), 200.0 * shininess);

            // Calculate the roughness
            float roughness = useRoughnessMap ? texture2D(roughnessMap, vUV).r : 0.0;
            spec *= (1.0 - roughness);

            // Calculate the Blinn-Phong components
            vec3 lightColor = directionalLights[0].color;
            vec3 ambient = ambientLightColor * ao;
            vec3 diffuse = diff * lightColor;
            vec3 specular = spec * lightColor;

            vec3 blinnPhong = (ambient + diffuse + specular) * albedo;

            // Final output
            gl_FragColor = vec4(blinnPhong, 1.0);
        }
    `;
}

export { BlinnPhongShadingModel };
