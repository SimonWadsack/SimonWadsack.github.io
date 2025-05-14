import { Vector2 } from 'three';
import { fetchTexture } from '../../../core/app.js';
import { TextureElement, ButtonSelectElement, Vec2Element, SliderElement } from 'lacery';
import { ShadingModel } from '../shadingModel.js';
import { Vec2Uniform, BoolUniform, TextureUniform, FloatUniform } from '../shadingUniform.js';

class PBRShadingModel extends ShadingModel {
    tiling;
    useMainTexture;
    mainTexture;
    useRoughnessMap;
    roughnessMap;
    roughness;
    useNormalMap;
    normalMap;
    normalStrength;
    useMetallicMap;
    metallicMap;
    metallic;
    useAOMap;
    aoMap;
    mainElement;
    roughnessElement;
    metallicElement;
    normalElement;
    aoElement;
    constructor() {
        super();
        this.enviroment = true;
        this.tiling = new Vec2Uniform("tiling", new Vector2(1, 1));
        this.useMainTexture = new BoolUniform("useMainTexture", false);
        this.mainTexture = new TextureUniform("mainTexture", null);
        this.useRoughnessMap = new BoolUniform("useRoughnessMap", false);
        this.roughnessMap = new TextureUniform("roughnessMap", null);
        this.roughness = new FloatUniform("roughness", 0.5);
        this.useMetallicMap = new BoolUniform("useMetallicMap", false);
        this.metallicMap = new TextureUniform("metallicMap", null);
        this.metallic = new FloatUniform("metallic", 0.5);
        this.useNormalMap = new BoolUniform("useNormalMap", false);
        this.normalMap = new TextureUniform("normalMap", null);
        this.normalStrength = new FloatUniform("normalStrength", 1.0);
        this.useAOMap = new BoolUniform("useAOMap", false);
        this.aoMap = new TextureUniform("aoMap", null);
        this.uniforms.add(this.tiling);
        this.uniforms.add(this.useMainTexture);
        this.uniforms.add(this.mainTexture);
        this.uniforms.add(this.roughnessMap);
        this.uniforms.add(this.useRoughnessMap);
        this.uniforms.add(this.roughness);
        this.uniforms.add(this.useMetallicMap);
        this.uniforms.add(this.metallicMap);
        this.uniforms.add(this.metallic);
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
        const metallicElement = new TextureElement('Metallic', this.metallicMap, 'blob');
        metallicElement.onChange(() => {
            this.useMetallicMap.value = metallicElement.hasTexture();
            this.metallicMap.update();
        });
        this.metallicElement = metallicElement;
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
        return "PBR";
    }
    getFragmentShader() {
        return pbrFragmentShader();
    }
    buildUI(group) {
        group.add(new ButtonSelectElement('Load a preset...', { 'metal': 'Metal', 'rustymetal': 'Rusty Metal', 'facade': 'Facade', 'onyx': 'Onyx', 'rock': 'Rock', 'mossyrock': 'Mossy Rock', 'bark': 'Bark' }, this.presetSelect.bind(this), { previews: ['textures/metal/albedo.jpg', 'textures/rustymetal/albedo.jpg', 'textures/facade/albedo.jpg', 'textures/onyx/albedo.jpg', 'textures/rock/albedo.jpg', 'textures/mossyrock/albedo.jpg', 'textures/bark/albedo.jpg'], previewSize: 64 }));
        const tilingElement = new Vec2Element('Tiling', this.tiling.value, 'x', 'y', { xStep: 0.1, yStep: 0.1 });
        group.add(tilingElement.onChange(() => {
            if (this.tiling.value.x < 0.1)
                this.tiling.value.x = 0.1;
            if (this.tiling.value.y < 0.1)
                this.tiling.value.y = 0.1;
            tilingElement.update();
        }));
        group.add(this.mainElement);
        group.add(this.roughnessElement);
        group.add(new SliderElement('Roughness', this.roughness, 'value', { min: 0.04, max: 1.0, step: 0.01 }));
        group.add(this.metallicElement);
        group.add(new SliderElement('Metallic Strength', this.metallic, 'value', { min: 0.0, max: 1.0, step: 0.01 }));
        group.add(this.normalElement);
        group.add(new SliderElement('Normal Strength', this.normalStrength, 'value', { min: 0.0, max: 1.0, step: 0.01 }));
        group.add(this.aoElement);
    }
    toJSON() {
        return {
            tiling: [this.tiling.value.x, this.tiling.value.y],
            roughness: this.roughness.value,
            normalStrength: this.normalStrength.value,
            metallic: this.metallic.value,
        };
    }
    fromJSON(json) {
        this.tiling.value.x = json.tiling[0];
        this.tiling.value.y = json.tiling[1];
        this.roughness.value = json.roughness;
        this.normalStrength.value = json.normalStrength;
        this.metallic.value = json.metallic;
    }
    dispose() {
        this.mainTexture.blob = null;
        this.mainTexture.update();
        this.roughnessMap.blob = null;
        this.roughnessMap.update();
        this.metallicMap.blob = null;
        this.metallicMap.update();
        this.normalMap.blob = null;
        this.normalMap.update();
        this.aoMap.blob = null;
        this.aoMap.update();
        this.mainElement.updateBlob();
        this.roughnessElement.updateBlob();
        this.metallicElement.updateBlob();
        this.normalElement.updateBlob();
        this.aoElement.updateBlob();
    }
    async presetSelect(folder) {
        const fileNames = {
            albedo: 'albedo.jpg',
            ambientocclusion: 'ao.jpg',
            //displacement: 'displacement.jpg',
            metallic: 'metallic.jpg',
            normal: 'normal.jpg',
            roughness: 'roughness.jpg',
        };
        try {
            const [albedo, ao, metallic, normal, roughness] = await Promise.all([
                fetchTexture(folder, fileNames.albedo),
                fetchTexture(folder, fileNames.ambientocclusion),
                //fetchTexture(folder, fileNames.displacement),
                fetchTexture(folder, fileNames.metallic),
                fetchTexture(folder, fileNames.normal),
                fetchTexture(folder, fileNames.roughness),
            ]);
            this.mainTexture.blob = albedo;
            this.useMainTexture.value = true;
            this.mainTexture.update();
            this.roughnessMap.blob = roughness;
            this.useRoughnessMap.value = true;
            this.roughnessMap.update();
            this.metallicMap.blob = metallic;
            this.useMetallicMap.value = true;
            this.metallicMap.update();
            this.normalMap.blob = normal;
            this.useNormalMap.value = true;
            this.normalMap.update();
            this.aoMap.blob = ao;
            this.useAOMap.value = true;
            this.aoMap.update();
            this.mainElement.updateBlob();
            this.roughnessElement.updateBlob();
            this.metallicElement.updateBlob();
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
function pbrFragmentShader() {
    return /*glsl*/ `
        uniform vec2 tiling;

        uniform bool useMainTexture;
        uniform sampler2D mainTexture;
        
        uniform bool useRoughnessMap;
        uniform sampler2D roughnessMap;
        uniform float roughness;

        uniform bool useMetallicMap;
        uniform sampler2D metallicMap;
        uniform float metallic;
        
        uniform bool useNormalMap;
        uniform sampler2D normalMap;
        uniform float normalStrength;

        uniform bool useAOMap;
        uniform sampler2D aoMap;

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

        vec3 getEnvColor(){
            vec3 envReflect = reflect(normalize(vPosition - cameraPosition), vWorldNormal);

            vec2 uv = vec2(atan(envReflect.z, envReflect.x) / (2.0 * PI) + 0.5, 
                   asin(envReflect.y) / PI + 0.5);
    
            vec3 envColor = texture2D(envMap, uv).rgb;

            return envColor;
        }

        vec3 fresnelSchlick(vec3 F0, float VdotH){
            return F0 + (1.0 - F0) * pow(1.0 - VdotH, 5.0);
        }

        float GSchlick(float dot, float k){
            return dot / (dot * (1.0 - k) + k);
        }

        float DGGX(float NdotH, float roughness){
            float alpha = roughness * roughness;
            float a2 = alpha * alpha;
            float inDenom = NdotH * NdotH * (a2 - 1.0) + 1.0;
            return a2 / (PI * inDenom * inDenom);
        }

        float SmithGGX(float NdotV, float NdotL, float roughness){
            float roughness1 = roughness + 1.0;
            float k = roughness1 * roughness1 / 8.0;
            return GSchlick(NdotV, k) * GSchlick(NdotL, k);
        }

        void main() {
            vec2 uv = vUV * tiling;

            vec3 albedo = useMainTexture ? texture2D(mainTexture, uv).rgb : vColor;
            
            vec3 normal = normalize(vNormal);
            if(useNormalMap){
                vec3 tangentNormal = texture2D(normalMap, uv).xyz * 2.0 - 1.0;
                float nrmStrength = normalStrength;
                vec3 worldNormal = normalize(vTBN * tangentNormal);
                normal = normalize(mix(normal, worldNormal, nrmStrength));
            }

            float rough = useRoughnessMap ? texture2D(roughnessMap, uv).r * roughness : roughness;

            float ao = useAOMap ? texture2D(aoMap, uv).r : 1.0;

            float metal = useMetallicMap ? texture2D(metallicMap, uv).r * metallic : metallic;

            vec3 lightColor = directionalLights[0].color;
            vec3 ambientColor = ambientLightColor;
            vec3 envColor = getEnvColor();

            vec3 ambient = ambientColor * albedo * ao;

            vec3 N = normal;
            vec3 L = directionalLights[0].direction;
            vec3 V = normalize(vViewPosition);
            vec3 H = normalize(L + V);

            float NdotL = max(dot(N, L), 0.0);
            float NdotV = max(dot(N, V), 0.0);
            float NdotH = max(dot(N, H), 0.0);
            float VdotH = max(dot(V, H), 0.0);

            vec3 F0 = mix(vec3(0.04), albedo, metal);
            vec3 F = fresnelSchlick(F0, VdotH);
            float D = DGGX(NdotH, rough);
            float G = SmithGGX(NdotV, NdotL, rough);

            float denom = 4.0 * NdotV * NdotL + 0.001;
            vec3 specular = (D * F * G) / denom;

            vec3 kS = F;
            vec3 kD = (1.0 - kS) * (1.0 - metal);
            vec3 diffuse = kD * albedo / PI;

            vec3 Lo = (diffuse + specular) * lightColor * NdotL;

            vec3 reflection = envColor * F * envMapIntensity;

            vec3 finalColor = Lo + ambient + reflection * (1.0 - rough) * metal;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
}

export { PBRShadingModel };
