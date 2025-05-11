import { Mesh, SphereGeometry, MeshBasicMaterial } from 'three';
import { VisualObject } from './visualObject.js';

var SceneProxyObjectMode;
(function (SceneProxyObjectMode) {
    SceneProxyObjectMode[SceneProxyObjectMode["LIGHTS"] = 0] = "LIGHTS";
    SceneProxyObjectMode[SceneProxyObjectMode["ENVIROMENT"] = 1] = "ENVIROMENT";
    SceneProxyObjectMode[SceneProxyObjectMode["SETTINGS"] = 2] = "SETTINGS";
})(SceneProxyObjectMode || (SceneProxyObjectMode = {}));
class SceneProxyObject extends VisualObject {
    mode;
    dirRotation;
    dirIntensity;
    dirColor;
    ambIntensity;
    ambColor;
    envMap;
    envIntensity;
    constructor() {
        const mesh = new Mesh(new SphereGeometry(0), new MeshBasicMaterial());
        mesh.visible = false;
        super('SceneProxyObject', mesh);
        this.type = 'SceneProxyObject';
        this.mode = SceneProxyObjectMode.LIGHTS;
        this.dirRotation = 0;
        this.dirIntensity = 1;
        this.dirColor = '#ffffff';
        this.ambIntensity = 0.2;
        this.ambColor = '#f0f0f0';
        this.envMap = 'outdoor';
        this.envIntensity = 1;
    }
    reset() {
        this.dirRotation = 0;
        this.dirIntensity = 1;
        this.dirColor = '#ffffff';
        this.ambIntensity = 0.2;
        this.ambColor = '#f0f0f0';
        this.envMap = 'outdoor';
        this.envIntensity = 1;
    }
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
    }
    toJSON() {
        return {
            name: this.name,
            type: this.type,
            position: this.getPosition(),
            color: this.color.getHex(),
            mode: this.mode,
            dirRotation: this.dirRotation,
            dirIntensity: this.dirIntensity,
            dirColor: this.dirColor,
            ambIntensity: this.ambIntensity,
            ambColor: this.ambColor,
            envMap: this.envMap,
            envIntensity: this.envIntensity,
        };
    }
    fromJSON(json) {
        this.mode = json.mode;
        this.dirRotation = json.dirRotation;
        this.dirIntensity = json.dirIntensity;
        this.dirColor = json.dirColor;
        this.ambIntensity = json.ambIntensity;
        this.ambColor = json.ambColor;
        this.envMap = json.envMap;
        this.envIntensity = json.envIntensity;
    }
    highlight() {
        // No implementation needed
    }
    resetHighlight() {
        // No implementation needed
    }
    select() {
        // No implementation needed
    }
    resetSelect() {
        // No implementation needed
    }
    updateColor(color) {
        // No implementation needed
    }
    dispose() {
        // No implementation needed
    }
}

export { SceneProxyObject };
