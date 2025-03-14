import * as THREE from 'three';
import { EventBus } from '../core/events.js';
import { TransformControls } from 'three/examples/jsm/Addons.js';
import { App } from '../core/app.js';

class SelectionManager {
    raycaster;
    mouse;
    mouseDown;
    hoveredObject;
    selectedObject;
    dragging;
    active;
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseDown = new THREE.Vector2();
        this.hoveredObject = null;
        this.selectedObject = null;
        this.dragging = false;
        this.active = false;
        const domElement = App.getRenderer().domElement;
        domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        domElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
        domElement.addEventListener('mouseup', (event) => this.onMouseUp(event));
        domElement.addEventListener('mouseenter', () => this.active = true);
        domElement.addEventListener('mouseleave', () => this.active = false);
        const transformControls = new TransformControls(App.getCamera(), domElement);
        transformControls.setTranslationSnap(0.01);
        transformControls.addEventListener('dragging-changed', (event) => {
            App.getOrbitControls().enabled = !event.value;
            this.dragging = event.value;
        });
        App.getScene().add(transformControls.getHelper());
        transformControls.addEventListener('objectChange', () => EventBus.notify('objectChanged', "general" /* EEnv.GENERAL */));
        App.setTransformControls(transformControls);
    }
    isActive() {
        return this.active;
    }
    getMouse() {
        return this.mouse;
    }
    onMouseMove(event) {
        const domElement = App.getRenderer().domElement;
        this.mouse.x = (event.clientX / domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / domElement.clientHeight) * 2 + 1;
        const tooltip = App.getTooltip();
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
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
            }
        }
    }
    update() {
        if (!this.active)
            return;
        this.raycaster.setFromCamera(this.mouse, App.getCamera());
        const intersects = this.raycaster.intersectObjects(App.getScene().children, true);
        const objectManager = App.getObjectManager();
        //do we have any intersections?
        if (intersects.length > 0) { //yes
            const mesh = this.findMesh(intersects); //find the mesh
            if (mesh == null) { //no mesh found, so reset the hovered object
                this.resetHovered();
                return;
            }
            //if the mesh is not associated with a visual object it must be editHandle or something else
            if (!objectManager.isVisualObject(mesh)) {
                this.resetHovered();
                if (objectManager.isEditHandle(mesh) && !this.dragging) { //is the object editHandle and we are not moving the orbit controls
                    //make the object moveable
                    App.getTransformControls().attach(mesh);
                }
                return;
            }
            const object = objectManager.getVisualObjectByMesh(mesh); //get the visual object from the object manager
            //if no object was found (only not selectable objects were found), reset the hovered object
            if (object == null) {
                this.resetHovered();
                return;
            }
            else if (objectManager.selectable(mesh) && !this.dragging) { //we found a selectable object and we are not moving the orbit controls
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
        App.getHierarchy().viewportHover(object.getUUID());
        this.doHover(object);
        this.showTooltip(object);
    }
    doHover(object) {
        if (this.hoveredObject && this.hoveredObject !== object) {
            this.hoveredObject.resetHighlight();
        }
        this.hoveredObject = object;
        this.hoveredObject.highlight();
    }
    resetHovered() {
        App.getHierarchy().viewportDehover();
        this.doResetHovered();
        this.hideTooltip();
    }
    doResetHovered() {
        if (this.hoveredObject) {
            this.hoveredObject.resetHighlight();
            this.hoveredObject = null;
        }
    }
    select(object) {
        App.getHierarchy().viewportSelect(object.getUUID());
        this.doSelect(object);
    }
    doSelect(object) {
        if (this.selectedObject && this.selectedObject !== object) {
            this.doResetSelected();
        }
        this.hoveredObject = null;
        this.selectedObject = object;
        this.selectedObject.select();
        EventBus.notify('objectSelected', "general" /* EEnv.GENERAL */, this.selectedObject);
    }
    resetSelected() {
        App.getHierarchy().viewportDeselect();
        this.doResetSelected();
    }
    doResetSelected() {
        if (this.selectedObject) {
            this.selectedObject.resetSelect();
            this.selectedObject = null;
            App.getTransformControls().detach();
            EventBus.notify('objectUnselected', "general" /* EEnv.GENERAL */);
        }
    }
    showTooltip(object) {
        App.getTooltip().innerHTML = "<b>" + object.getName() + "</b></br><i>Type:</i> " + object.getType();
        App.getTooltip().style.display = 'block';
    }
    hideTooltip() {
        App.getTooltip().style.display = 'none';
    }
    //find the first selectable object in the list of intersects
    findMesh(intersects) {
        for (const intersect of intersects) {
            if (!(intersect.object instanceof THREE.Mesh))
                continue;
            if (App.getObjectManager().selectable(intersect.object) || App.getObjectManager().isEditHandle(intersect.object)) { //selectable and isEditHandle
                return intersect.object;
            }
        }
        return null;
    }
}

export { SelectionManager };
