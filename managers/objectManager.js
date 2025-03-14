import { EventBus } from '../core/events.js';

class ObjectManager {
    scene;
    grid;
    plane;
    objects;
    meshLookup;
    constructor(scene, grid, plane) {
        this.scene = scene;
        this.grid = grid;
        this.plane = plane;
        this.objects = new Map();
        this.meshLookup = new Map();
    }
    addObject(visualObject) {
        const mesh = visualObject.getMesh();
        if (!mesh) {
            console.error(`addObject: Object with id ${visualObject.getUUID()} has no mesh!`);
            return;
        }
        this.scene.add(mesh);
        this.objects.set(visualObject.getUUID(), visualObject);
        this.meshLookup.set(mesh, visualObject);
        EventBus.notify('objectAdded', visualObject);
    }
    getObjectByUUID(uuid) {
        if (!this.objects.has(uuid)) {
            console.error(`getObjectById: Object with uuid ${uuid} not found!`);
            return null;
        }
        return this.objects.get(uuid);
    }
    selectable(mesh) {
        return this.meshLookup.has(mesh);
    }
    isEditHandle(mesh) {
        return mesh.userData.isEditHandle;
    }
    isVisualObject(mesh) {
        return this.meshLookup.has(mesh);
    }
    getVisualObjectByMesh(mesh) {
        if (!this.meshLookup.has(mesh)) {
            console.error(`getVisualObjectByMesh: Object with mesh ${mesh} not found!`);
            return null;
        }
        return this.meshLookup.get(mesh);
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
        this.scene.remove(mesh);
        this.objects.delete(uuid);
        this.meshLookup.delete(mesh);
        EventBus.notify('objectRemoved', visualObject);
    }
    getObjects() {
        return Array.from(this.objects.values());
    }
    isGrid(object) {
        return object === this.grid;
    }
    isPlane(object) {
        return object === this.plane;
    }
}

export { ObjectManager };
