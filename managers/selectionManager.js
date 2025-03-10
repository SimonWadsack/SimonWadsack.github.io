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
    active;
    hierarchy;
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
        this.active = false;
        this.hierarchy = null;
        domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        domElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
        domElement.addEventListener('mouseup', (event) => this.onMouseUp(event));
        domElement.addEventListener('mouseenter', () => this.active = true);
        domElement.addEventListener('mouseleave', () => this.active = false);
        const transformControls = new TransformControls(this.camera, this.domElement);
        transformControls.addEventListener('dragging-changed', (event) => {
            controls.enabled = !event.value;
            this.dragging = event.value;
        });
        this.scene.add(transformControls.getHelper());
        this.transformControls = transformControls;
        this.transformControls.addEventListener('objectChange', () => EventBus.notify('objectChanged'));
    }
    registerHierachy(hierarchy) {
        this.hierarchy = hierarchy;
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
            this.select(this.hoveredObject);
        }
        else { //we clicked somehwere else and did not move the mouse
            if (this.selectedObject && Math.abs(this.mouseDown.x - event.clientX) < 5 && Math.abs(this.mouseDown.y - event.clientY) < 5) {
                this.resetSelected();
                this.transformControls.detach();
            }
        }
    }
    update() {
        if (!this.active)
            return;
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
                this.hover(object);
            }
            else { //not selectable and not editHandle, so reset the hovered object
                this.resetHovered();
            }
        }
        else { //no, so reset the hovered object
            this.resetHovered();
        }
    }
    hover(object) {
        if (this.hierarchy) {
            this.hierarchy.viewportHover(object.getUUID());
        }
        this.doHover(object);
    }
    doHover(object) {
        if (this.hoveredObject && this.hoveredObject !== object) {
            this.hoveredObject.resetHighlight();
        }
        this.hoveredObject = object;
        this.hoveredObject.highlight();
    }
    resetHovered() {
        if (this.hierarchy) {
            this.hierarchy.viewportDehover();
        }
        this.doResetHovered();
    }
    doResetHovered() {
        if (this.hoveredObject) {
            this.hoveredObject.resetHighlight();
            this.hoveredObject = null;
        }
    }
    select(object) {
        if (this.hierarchy) {
            this.hierarchy.viewportSelect(object.getUUID());
        }
        this.doSelect(object);
    }
    doSelect(object) {
        if (this.selectedObject && this.selectedObject !== object) {
            this.selectedObject.resetSelect();
            EventBus.notify('objectUnselected');
        }
        this.hoveredObject = null;
        this.selectedObject = object;
        this.selectedObject.select();
        EventBus.notify('objectSelected', this.selectedObject);
    }
    resetSelected() {
        if (this.hierarchy) {
            this.hierarchy.viewportDeselect();
        }
        this.doResetSelected();
    }
    doResetSelected() {
        if (this.selectedObject) {
            this.selectedObject.resetSelect();
            this.selectedObject = null;
            EventBus.notify('objectUnselected');
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
