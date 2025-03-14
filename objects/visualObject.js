import { Color, MathUtils, Vector3, SphereGeometry, MeshBasicMaterial, Mesh } from 'three';
import { getEditHandleColor } from '../core/vars.js';

/**
 * An abstract class that represents a visual object in the scene.
 *
 * @abstract
 */
class VisualObject {
    name;
    mesh;
    geometry;
    material;
    uuid;
    type;
    color = new Color(0x000000);
    editHandles;
    /**
     * Creates a visual object.
     *
     * @param {string} name The name of the visual object
     * @constructor
     */
    constructor(name) {
        this.name = name;
        this.mesh = null;
        this.geometry = null;
        this.material = null;
        this.uuid = MathUtils.generateUUID();
        this.type = 'VisualObject';
        this.editHandles = new Map();
    }
    //#region getters and setters
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getColor() {
        return this.color.clone();
    }
    setColor(color) {
        this.color.set(color);
    }
    getUUID() {
        return this.uuid;
    }
    getType() {
        return this.type;
    }
    getMesh() {
        if (!this.checkMesh("getMesh"))
            return null;
        return this.mesh;
    }
    setMesh(mesh) {
        this.mesh = mesh;
        this.mesh.castShadow = true;
    }
    getPosition() {
        if (!this.checkMesh("getPosition"))
            return null;
        const result = new Vector3();
        result.copy(this.mesh.position);
        return result;
    }
    setPosition(position) {
        if (!this.checkMesh("setPosition"))
            return;
        this.mesh.position.set(position.x, position.y, position.z);
    }
    //#region moving
    move(x, y, z) {
        if (!this.checkMesh("move"))
            return;
        var position = this.getPosition();
        if (!position)
            return;
        position.x += x;
        position.y += y;
        position.z += z;
        this.setPosition(position);
    }
    moveX(x) {
        this.move(x, 0, 0);
    }
    moveY(y) {
        this.move(0, y, 0);
    }
    moveZ(z) {
        this.move(0, 0, z);
    }
    //#endregion
    //#endregion
    //#region editing
    edit() {
        console.warn('VisualObject: Edit not implemented!');
        return () => { console.error('VisualObject: Edit not implemented!'); };
    }
    //#region edit handles
    createEditHandle(index) {
        if (!this.checkMesh("createEditHandle"))
            return;
        const geometry = new SphereGeometry(0.2);
        const material = new MeshBasicMaterial({ color: getEditHandleColor() });
        const handle = new Mesh(geometry, material);
        handle.castShadow = true;
        handle.userData.isEditHandle = true;
        this.editHandles.set(index, handle);
        this.mesh.add(handle);
    }
    hasEditHandle(index) {
        return this.editHandles.has(index);
    }
    setEditHandlePosition(index, position) {
        if (!this.editHandles.has(index)) {
            console.error('VisualObject:setEditHandlePosition: Edit handle not found!');
            return;
        }
        const object = this.editHandles.get(index);
        if (!object)
            return;
        object.position.set(position.x, position.y, position.z);
    }
    getEditHandlePosition(index) {
        if (!this.editHandles.has(index)) {
            console.error('VisualObject:getEditHandlePosition: Edit handle not found!');
            return null;
        }
        const object = this.editHandles.get(index);
        if (!object)
            return null;
        return object.position;
    }
    removeEditHandle(index) {
        if (!this.checkMesh("removeEditHandle"))
            return;
        if (!this.editHandles.has(index)) {
            console.error('VisualObject:removeEditHandle: Edit handle not found!');
            return;
        }
        const object = this.editHandles.get(index);
        if (!object)
            return;
        this.mesh.remove(object);
        this.editHandles.delete(index);
    }
    removeEditHandles() {
        if (!this.checkMesh("removeEditHandles"))
            return;
        this.editHandles.forEach((handle, index) => {
            this.mesh.remove(handle);
        });
        this.editHandles.clear();
    }
    //#endregion
    unedit() {
        console.warn('VisualObject: Unedit not implemented!');
    }
    //#endregion
    //#region checks
    checkMesh(origin) {
        if (this.mesh === null) {
            console.error('VisualObject: Mesh not set: ', origin);
            return false;
        }
        return true;
    }
    checkMaterial(origin) {
        if (this.material === null) {
            console.error('VisualObject: Material not set: ', origin);
            return false;
        }
        return true;
    }
    checkGeometry(origin) {
        if (this.geometry === null) {
            console.error('VisualObject: Geometry not set: ', origin);
            return false;
        }
        return true;
    }
}

export { VisualObject };
