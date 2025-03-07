import * as THREE from 'three';
import { EventBus } from '../core/events.js';
import { TransformControls } from 'three/examples/jsm/Addons.js';

class SelectionManager {
    scene;
    camera;
    objectManager;
    domElement;
    transformControls;
    raycaster;
    mouse;
    mouseDown;
    hoveredObject;
    selectedObject;
    dragging;
    constructor(scene, camera, objectManager, controls, domElement) {
        this.scene = scene;
        this.camera = camera;
        this.objectManager = objectManager;
        this.domElement = domElement;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseDown = new THREE.Vector2();
        this.hoveredObject = null;
        this.selectedObject = null;
        this.dragging = false;
        domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        domElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
        domElement.addEventListener('mouseup', (event) => this.onMouseUp(event));
        const transformControls = new TransformControls(this.camera, this.domElement);
        transformControls.addEventListener('dragging-changed', (event) => {
            controls.enabled = !event.value;
            this.dragging = event.value;
        });
        this.scene.add(transformControls.getHelper());
        this.transformControls = transformControls;
    }
    getTransformControls() {
        return this.transformControls;
    }
    onMouseMove(event) {
        this.mouse.x = (event.clientX / this.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.domElement.clientHeight) * 2 + 1;
    }
    onMouseDown(event) {
        this.mouseDown.x = event.clientX;
        this.mouseDown.y = event.clientY;
    }
    onMouseUp(event) {
        if (this.hoveredObject) { //clicked on hovered object
            if (this.selectedObject) { //we already have a selected object
                this.selectedObject.resetColor();
                this.selectedObject = null;
                this.transformControls.detach();
                EventBus.notify('objectUnselected');
            }
            //select the hovered object
            this.selectedObject = this.hoveredObject;
            this.hoveredObject = null;
            this.selectedObject.select();
            EventBus.notify('objectSelected', this.selectedObject);
        }
        else { //we clicked somehwere else and did not move the mouse
            if (this.selectedObject && Math.abs(this.mouseDown.x - event.clientX) < 5 && Math.abs(this.mouseDown.y - event.clientY) < 5) {
                this.selectedObject.resetColor();
                this.selectedObject = null;
                this.transformControls.detach();
                EventBus.notify('objectUnselected');
            }
        }
    }
    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        //do we have any intersections?
        if (intersects.length > 0) { //yes
            const mesh = this.findMesh(intersects); //find the mesh
            if (mesh == null) { //no mesh found, so reset the hovered object
                this.resetHovered();
                return;
            }
            //if the mesh is not associated with a visual object it must be editHandle or something else
            if (!this.objectManager.isVisualObject(mesh)) {
                this.resetHovered();
                if (this.objectManager.isEditHandle(mesh) && !this.dragging) { //is the object editHandle and we are not moving the orbit controls
                    //make the object moveable
                    this.transformControls.attach(mesh);
                }
                return;
            }
            const object = this.objectManager.getVisualObjectByMesh(mesh); //get the visual object from the object manager
            //if no object was found (only not selectable objects were found), reset the hovered object
            if (object == null) {
                this.resetHovered();
                return;
            }
            else if (this.objectManager.selectable(mesh) && !this.dragging) { //we found a selectable object and we are not moving the orbit controls
                if (this.selectedObject && this.selectedObject === object) { // is the object the selected object?
                    return;
                }
                if (this.hoveredObject && this.hoveredObject !== object) { //if we hovered over an object and it is not the same as the current object, reset
                    this.resetHovered();
                }
                //highlight the object
                object.highlight();
                this.hoveredObject = object;
            }
            else { //not selectable and not editHandle, so reset the hovered object
                this.resetHovered();
            }
        }
        else { //no, so reset the hovered object
            this.resetHovered();
        }
    }
    resetHovered() {
        if (this.hoveredObject) {
            this.hoveredObject.resetColor();
            this.hoveredObject = null;
        }
    }
    //find the first selectable object in the list of intersects
    findMesh(intersects) {
        for (const intersect of intersects) {
            if (!(intersect.object instanceof THREE.Mesh))
                continue;
            if (this.objectManager.selectable(intersect.object) || this.objectManager.isEditHandle(intersect.object)) { //selectable and isEditHandle
                return intersect.object;
            }
        }
        return null;
    }
}

export { SelectionManager };
