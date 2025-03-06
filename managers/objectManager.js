import 'three';

class ObjectManager {
    /**
     * 
     * @param {THREE.Scene} scene
     * @param {THREE.GridHelper} grid
     * @param {THREE.Mesh} plane
     */
    constructor(scene, grid, plane) {
        this.scene = scene;
        this.grid = grid;
        this.plane = plane;
        this.objects = new Map();
        this.meshLookup = new Map();
    }

    addObject(visualObject) {
        const mesh = visualObject.getMesh();
        this.scene.add(mesh);
        this.objects.set(visualObject.getUUID(), visualObject);
        this.meshLookup.set(mesh, visualObject);
    }

    /*addEditObject(object, mesh){
        object.userData.selectable = false;
        object.userData.editable = true;
        mesh.add(object);
        const editObject = { object: object, mesh: mesh };
        this.editObjects.push(editObject);
    }*/

    getObjectByUUID(uuid) {
        if (!this.objects.has(uuid)) {
            console.error(`getObjectById: Object with uuid ${uuid} not found!`);
            return null;
        }
        return this.objects.get(uuid);
    }

    selectable(mesh){
        return this.meshLookup.has(mesh);
    }

    isEditHandle(mesh){
        return mesh.userData.isEditHandle;
    }

    isVisualObject(mesh){
        return this.meshLookup.has(mesh);  
    }

    getVisualObjectByMesh(mesh) {
        if (!this.meshLookup.has(mesh)) {
            console.error(`getVisualObjectByMesh: Object with mesh ${mesh} not found!`);
            return null;
        }
        return this.meshLookup.get(mesh);
    }

    /**
     * 
     * @param {string} id
     * @returns {void}
     * @description Removes an object from the scene
     */
    removeObject(uuid) {
        const visualObject = this.getObjectById(uuid);
        if (!visualObject) {
            console.error(`removeObject: Object with id ${uuid} not found!`);
            return;
        }

        const mesh = visualObject.getMesh();
        this.scene.remove(mesh);
        this.objects.delete(uuid);
        this.meshLookup.delete(mesh);
    }

    /*removeEditObjects(){
        this.editObjects.forEach(editObject => editObject.mesh.remove(editObject.object));
        this.editObjects = [];
    }*/

    /**
     * 
     * @param {Mesh} object
     * @returns {boolean} True if the object is the grid, false otherwise
     */
    isGrid(object){
        return object === this.grid;
    }
  
    /**
     * 
     * @param {Mesh} object
     * @returns {boolean} True if the object is the plane, false otherwise
     */
    isPlane(object){
        return object === this.plane;
    }
}

export { ObjectManager };
