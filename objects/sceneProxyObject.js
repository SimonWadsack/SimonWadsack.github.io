import { Mesh, SphereGeometry, MeshBasicMaterial } from 'three';
import { VisualObject } from './visualObject.js';

var SceneProjectObjectMode;
(function (SceneProjectObjectMode) {
    SceneProjectObjectMode[SceneProjectObjectMode["LIGHTS"] = 0] = "LIGHTS";
    SceneProjectObjectMode[SceneProjectObjectMode["SETTINGS"] = 1] = "SETTINGS";
})(SceneProjectObjectMode || (SceneProjectObjectMode = {}));
class SceneProxyObject extends VisualObject {
    constructor() {
        const mesh = new Mesh(new SphereGeometry(0), new MeshBasicMaterial());
        mesh.visible = false;
        super('SceneProxyObject', mesh);
    }
    getMode() {
        return SceneProjectObjectMode.LIGHTS;
    }
    setMode(mode) {
        // Cannot change Mode
    }
    toJSON() {
        return {
            name: this.name,
            type: this.type,
            position: this.getPosition(),
            color: this.color.getHex()
        };
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
}

export { SceneProxyObject };
