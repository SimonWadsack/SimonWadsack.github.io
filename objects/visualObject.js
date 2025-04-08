import { Color, Vector3, MathUtils } from 'three';
import { EditHandle } from './editHandle.js';
import { App } from '../core/app.js';

/**
 * An abstract class that represents a visual object in the scene.
 *
 * @abstract
 */
class VisualObject {
    name;
    mesh;
    uuid;
    type;
    export;
    color = new Color(0x000000);
    editHandles;
    /**
     * Creates a visual object.
     *
     * @param {string} name The name of the visual object
     * @constructor
     */
    constructor(name, mesh, position = new Vector3(0, 0, 0)) {
        this.name = name;
        this.mesh = mesh;
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.castShadow = true;
        this.uuid = MathUtils.generateUUID();
        this.type = 'VisualObject';
        this.export = null;
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
    getExport() {
        return this.export;
    }
    getMesh() {
        return this.mesh;
    }
    getPosition() {
        const result = new Vector3();
        result.copy(this.mesh.position);
        return result;
    }
    setPosition(position) {
        this.mesh.position.set(position.x, position.y, position.z);
    }
    //#region moving
    move(x, y, z) {
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
    createEditHandle(index, radius = 0.2) {
        const editHandle = new EditHandle(this, index, radius);
        this.editHandles.set(index, editHandle);
        App.getObjectManager().addEditHandle(editHandle);
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
        object.setPosition(position);
    }
    getEditHandlePosition(index) {
        if (!this.editHandles.has(index)) {
            console.error('VisualObject:getEditHandlePosition: Edit handle not found!');
            return null;
        }
        const object = this.editHandles.get(index);
        if (!object)
            return null;
        return object.getPosition();
    }
    removeEditHandle(index) {
        if (!this.editHandles.has(index)) {
            console.error('VisualObject:removeEditHandle: Edit handle not found!');
            return;
        }
        const editHandle = this.editHandles.get(index);
        if (!editHandle)
            return;
        App.getObjectManager().removeEditHandle(editHandle);
        this.editHandles.delete(index);
    }
    removeEditHandles() {
        this.editHandles.forEach((handle, index) => {
            App.getObjectManager().removeEditHandle(handle);
        });
        this.editHandles.clear();
    }
    hideEditHandle(index) {
        if (!this.editHandles.has(index)) {
            console.error('VisualObject:hideEditHandle: Edit handle not found!');
            return;
        }
        const editHandle = this.editHandles.get(index);
        if (!editHandle)
            return;
        editHandle.hide();
    }
    showEditHandle(index) {
        if (!this.editHandles.has(index)) {
            console.error('VisualObject:showEditHandle: Edit handle not found!');
            return;
        }
        const editHandle = this.editHandles.get(index);
        if (!editHandle)
            return;
        editHandle.show();
    }
    hideEditHandles() {
        this.editHandles.forEach((handle, index) => {
            handle.hide();
        });
    }
    showEditHandles() {
        this.editHandles.forEach((handle, index) => {
            handle.show();
        });
    }
    //#endregion
    unedit() {
        console.warn('VisualObject: Unedit not implemented!');
    }
}

export { VisualObject };
