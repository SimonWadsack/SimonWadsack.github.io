import { EventBus } from '../core/events.js';
import { App } from '../core/app.js';

class ObjectManager {
    objects;
    meshLookup;
    editHandleLookup;
    constructor() {
        this.objects = new Map();
        this.meshLookup = new Map();
        this.editHandleLookup = new Map();
    }
    addObject(visualObject) {
        const mesh = visualObject.getMesh();
        if (!mesh) {
            console.error(`addObject: Object with id ${visualObject.getUUID()} has no mesh!`);
            return;
        }
        App.getScene().add(mesh);
        this.objects.set(visualObject.getUUID(), visualObject);
        this.meshLookup.set(mesh, visualObject);
        EventBus.notify('objectAdded', "general" /* EEnv.GENERAL */, visualObject);
    }
    addEditHandle(editHandle) {
        const parent = editHandle.getParentObject();
        const parentMesh = parent.getMesh();
        if (!parentMesh) {
            console.error(`addEditHandle: Parent has no mesh!`);
            return;
        }
        const mesh = editHandle.getMesh();
        parentMesh.add(mesh);
        this.editHandleLookup.set(mesh, editHandle);
        EventBus.notify('editHandleAdded', "general" /* EEnv.GENERAL */, editHandle);
    }
    getObjectByUUID(uuid) {
        if (!this.objects.has(uuid)) {
            console.error(`getObjectById: Object with uuid ${uuid} not found!`);
            return null;
        }
        return this.objects.get(uuid);
    }
    selectable(mesh) {
        if (mesh.userData.collision && mesh.userData.object)
            return true;
        return this.meshLookup.has(mesh);
    }
    isEditHandle(mesh) {
        if (this.editHandleLookup.has(mesh)) {
            const editHandle = this.editHandleLookup.get(mesh);
            if (editHandle && editHandle.getActive()) {
                return true;
            }
        }
        return false;
    }
    isVisualObject(mesh) {
        if (mesh.userData.collision && mesh.userData.object)
            return true;
        return this.meshLookup.has(mesh);
    }
    getVisualObjectByMesh(mesh) {
        if (!this.meshLookup.has(mesh)) {
            if (mesh.userData.collision && mesh.userData.object)
                return mesh.userData.object;
            console.error(`getVisualObjectByMesh: Object with mesh ${mesh} not found!`);
            return null;
        }
        return this.meshLookup.get(mesh);
    }
    getEditHandleByMesh(mesh) {
        if (!this.editHandleLookup.has(mesh)) {
            console.error(`getEditHandleByMesh: Edit handle with mesh ${mesh} not found!`);
            return null;
        }
        return this.editHandleLookup.get(mesh);
    }
    removeObject(uuid) {
        const visualObject = this.getObjectByUUID(uuid);
        if (!visualObject) {
            console.error(`removeObject: Object with id ${uuid} not found!`);
            return;
        }
        const mesh = visualObject.getMesh();
        if (!mesh) {
            console.error(`removeObject: Object with id ${uuid} has no mesh!`);
            return;
        }
        visualObject.dispose();
        App.getScene().remove(mesh);
        this.objects.delete(uuid);
        this.meshLookup.delete(mesh);
        EventBus.notify('objectRemoved', "all" /* EEnv.ALL */, visualObject);
    }
    removeObjects() {
        this.objects.forEach((object, uuid) => {
            this.removeObject(uuid);
        });
        this.objects.clear();
        this.meshLookup.clear();
        this.editHandleLookup.clear();
    }
    removeEditHandle(editHandle) {
        if (!editHandle) {
            console.error(`removeEditHandle: Edit handle ${editHandle} not found!`);
            return;
        }
        const parent = editHandle.getParentObject();
        const parentMesh = parent.getMesh();
        if (!parentMesh) {
            console.error(`removeEditHandle: Parent has no mesh!`);
            return;
        }
        const mesh = editHandle.getMesh();
        parentMesh.remove(mesh);
        this.editHandleLookup.delete(mesh);
        EventBus.notify('editHandleRemoved', "all" /* EEnv.ALL */, editHandle);
    }
    getObjects() {
        return Array.from(this.objects.values());
    }
    isGrid(object) {
        return object === App.getGrid();
    }
    isPlane(object) {
        return object === App.getPlane();
    }
}

export { ObjectManager };
