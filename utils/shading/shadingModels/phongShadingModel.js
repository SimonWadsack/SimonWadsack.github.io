import { App } from '../../../core/app.js';
import { SliderElement } from '../../../lacery/elements/sliderElement.js';
import 'three';
import { ShadingModel } from '../shadingModel.js';
import { Vec3Uniform, ColorUniform, FloatUniform } from '../shadingUniform.js';

class PhongShadingModel extends ShadingModel {
    lightDirection;
    lightColor;
    lightIntensity;
    ambientIntensity;
    ambientColor;
    specularIntensity;
    specularPower;
    constructor(specularIntensity = 0.3, specularPower = 16.0) {
        super();
        this.lightDirection = new Vec3Uniform("lightDirection", App.getDirectionalLight().position.clone());
        this.lightColor = new ColorUniform("lightColor", App.getDirectionalLight().color.clone());
        this.lightIntensity = new FloatUniform("lightIntensity", App.getDirectionalLight().intensity);
        this.ambientIntensity = new FloatUniform("ambientIntensity", App.getAmbientLight().intensity);
        this.ambientColor = new ColorUniform("ambientColor", App.getAmbientLight().color.clone());
        this.specularIntensity = new FloatUniform("specularIntensity", specularIntensity);
        this.specularPower = new FloatUniform("specularPower", specularPower);
        this.uniforms.add(this.lightDirection);
        this.uniforms.add(this.lightColor);
        this.uniforms.add(this.lightIntensity);
        this.uniforms.add(this.ambientIntensity);
        this.uniforms.add(this.ambientColor);
        this.uniforms.add(this.specularIntensity);
        this.uniforms.add(this.specularPower);
    }
    getName() {
        return "Phong";
    }
    getFragmentShader() {
        return phongFragmentShader();
    }
    buildUI(group) {
        group.add(new SliderElement('Specular Intensity', this.specularIntensity, 'value', { min: 0, max: 1, step: 0.1 }));
        group.add(new SliderElement('Specular Power', this.specularPower, 'value', { min: 1, max: 64, step: 1 }));
    }
    toJSON() {
        return {
            specularIntensity: this.specularIntensity.value,
            specularPower: this.specularPower.value,
        };
    }
    fromJSON(json) {
        this.specularIntensity.value = json.specularIntensity;
        this.specularPower.value = json.specularPower;
    }
}
function phongFragmentShader() {
    return /*glsl*/ `
        uniform vec3 lightDirection;
        uniform vec3 lightColor;
        uniform float lightIntensity;
        uniform float ambientIntensity;
        uniform vec3 ambientColor;
        uniform float specularIntensity;  
        uniform float specularPower; 
    
        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
    
        void main(){
            // Normalize the normal vector and compute the light direction
            vec3 norm = normalize(vNormal);
    
            vec3 lightDir = normalize(-lightDirection);
    
            // Ambient lighting
            vec3 ambient = ambientIntensity * ambientColor;
    
            // Diffuse lighting (Lambert's cosine law)
            float diff = max(dot(norm, lightDir), 0.0);
            vec3 diffuse = diff * lightColor * lightIntensity;
    
            // Specular lighting (Phong reflection model)
            vec3 viewDir = normalize(vPosition - cameraPosition);
            vec3 reflectDir = reflect(-lightDir, norm);   // Reflection direction
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
            vec3 specular = spec * specularIntensity * lightColor * lightIntensity;
    
            // Combine all lighting components
            vec3 finalColor = (ambient + diffuse + specular) * vColor;
    
            // Output the final color
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
}

export { PhongShadingModel };
