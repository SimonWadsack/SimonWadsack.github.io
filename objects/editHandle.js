import { SphereGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three';
import { getEditHandleColor, getHighlightColor, getSelectedColor } from '../core/vars.js';
import { App } from '../core/app.js';
import { EventBus } from '../core/events.js';

class EditHandle {
    parentObject;
    index;
    radius;
    mesh;
    material;
    constructor(parent, index, radius = 0.2) {
        this.parentObject = parent;
        this.index = index;
        this.radius = radius;
        const geometry = new SphereGeometry(this.radius);
        this.material = new MeshBasicMaterial({ color: getEditHandleColor(), depthTest: false, transparent: true });
        this.mesh = new Mesh(geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.renderOrder = 1001;
        this.adjustScale();
        App.onControlsChange(this.adjustScale.bind(this));
        EventBus.subscribe('modeSwitched', "all" /* EEnv.ALL */, () => {
            this.material.color.set(getEditHandleColor());
        });
    }
    getMesh() {
        return this.mesh;
    }
    getParentObject() {
        return this.parentObject;
    }
    getIndex() {
        return this.index;
    }
    getPosition() {
        return this.mesh.position.clone();
    }
    getWorldPosition() {
        return this.mesh.getWorldPosition(new Vector3());
    }
    setPosition(position) {
        this.mesh.position.set(position.x, position.y, position.z);
    }
    highlight() {
        this.material.color.set(getHighlightColor());
    }
    resetHighlight() {
        this.material.color.set(getEditHandleColor());
    }
    select() {
        this.material.color.set(getSelectedColor());
    }
    resetSelect() {
        this.material.color.set(getEditHandleColor());
    }
    hide() {
        this.mesh.visible = false;
    }
    show() {
        this.mesh.visible = true;
    }
    getActive() {
        return this.mesh.visible;
    }
    adjustScale() {
        if (App.dimension2D()) {
            this.mesh.scale.set(1, 1, 1);
            return;
        }
        const distance = this.mesh.position.distanceTo(App.getCamera().position);
        const absDistance = Math.abs(distance);
        const scale = absDistance / 10;
        const minMaxScale = Math.max(1, Math.min(scale, 20));
        this.mesh.scale.set(minMaxScale, minMaxScale, minMaxScale);
    }
}

export { EditHandle };
