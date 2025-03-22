import * as THREE from 'three';
import { EventBus } from '../core/events.js';
import { VisualObject } from '../objects/visualObject.js';
import { App } from '../core/app.js';
import { EditHandle } from '../objects/editHandle.js';

class SelectionManager {
    raycaster;
    mouse;
    mouseDown;
    hoveredObject;
    hoveredEditHandle;
    selectedObject;
    selectedEditHandle;
    active;
    canEdit;
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseDown = new THREE.Vector2();
        this.hoveredObject = null;
        this.hoveredEditHandle = null;
        this.selectedObject = null;
        this.selectedEditHandle = null;
        this.active = false;
        this.canEdit = true;
        const domElement = App.getRenderer().domElement;
        domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        domElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
        domElement.addEventListener('mouseup', (event) => this.onMouseUp(event));
        domElement.addEventListener('mouseenter', () => this.active = true);
        domElement.addEventListener('mouseleave', () => this.active = false);
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
        var deselectedEditHandle = false;
        if (this.hoveredEditHandle) {
            this.selectEditHandle(this.hoveredEditHandle);
            return;
        }
        else {
            if (this.selectedEditHandle && Math.abs(this.mouseDown.x - event.clientX) < 5 && Math.abs(this.mouseDown.y - event.clientY) < 5) {
                this.resetSelectedEditHandle();
                deselectedEditHandle = true;
            }
        }
        if (this.hoveredObject) { //clicked on hovered object
            this.select(this.hoveredObject);
        }
        else { //we clicked somehwere else and did not move the mouse
            if (!deselectedEditHandle && this.selectedObject && Math.abs(this.mouseDown.x - event.clientX) < 5 && Math.abs(this.mouseDown.y - event.clientY) < 5) {
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
                this.resetHoveredEditHandle();
                return;
            }
            if (objectManager.isEditHandle(mesh)) { //is the mesh an edit handle?
                if (!this.canEdit)
                    return;
                const editHandle = objectManager.getEditHandleByMesh(mesh); //get the edit handle from the object manager
                if (editHandle == null) {
                    this.resetHoveredEditHandle();
                    return;
                }
                else if (this.selectedEditHandle && this.selectedEditHandle === editHandle) { // is the edit handle the selected edit handle?
                    return;
                }
                this.hoverEditHandle(editHandle);
                return;
            }
            else {
                this.resetHoveredEditHandle();
            }
            const object = objectManager.getVisualObjectByMesh(mesh); //get the visual object from the object manager
            //if no object was found (only not selectable objects were found), reset the hovered object
            if (object == null) {
                this.resetHovered();
                return;
            }
            else if (objectManager.selectable(mesh) && !App.isDragging()) { //we found a selectable object and we are not moving the orbit controls
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
            this.resetHoveredEditHandle();
        }
    }
    //#region Editing
    enableEditing() {
        this.canEdit = true;
    }
    disableEditing() {
        this.canEdit = false;
        this.resetSelectedEditHandle();
    }
    //#endregion
    hover(object) {
        App.getHierarchy().viewportHover(object.getUUID());
        this.doHover(object);
        this.showTooltip(object);
    }
    hoverEditHandle(editHandle) {
        this.doHoverEditHandle(editHandle);
        this.showTooltip(editHandle);
    }
    doHover(object) {
        if (this.hoveredObject && this.hoveredObject !== object) {
            this.hoveredObject.resetHighlight();
        }
        this.hoveredObject = object;
        this.hoveredObject.highlight();
    }
    doHoverEditHandle(editHandle) {
        if (this.hoveredEditHandle && this.hoveredEditHandle !== editHandle) {
            this.hoveredEditHandle.resetHighlight();
        }
        this.hoveredEditHandle = editHandle;
        this.hoveredEditHandle.highlight();
    }
    resetHovered() {
        App.getHierarchy().viewportDehover();
        this.doResetHovered();
        this.hideTooltip();
    }
    resetHoveredEditHandle() {
        this.doResetHoveredEditHandle();
        this.hideTooltip();
    }
    doResetHovered() {
        if (this.hoveredObject) {
            this.hoveredObject.resetHighlight();
            this.hoveredObject = null;
        }
    }
    doResetHoveredEditHandle() {
        if (this.hoveredEditHandle) {
            this.hoveredEditHandle.resetHighlight();
            this.hoveredEditHandle = null;
        }
    }
    select(object) {
        App.getHierarchy().viewportSelect(object.getUUID());
        this.doSelect(object);
    }
    selectEditHandle(editHandle) {
        this.doSelectEditHandle(editHandle);
    }
    doSelect(object) {
        if (this.selectedObject && this.selectedObject !== object) {
            this.doResetSelected();
        }
        this.hoveredObject = null;
        this.selectedObject = object;
        this.selectedObject.select();
        EventBus.notify('objectSelected', "viewport" /* EEnv.VIEWPORT */, this.selectedObject);
    }
    doSelectEditHandle(editHandle) {
        if (this.selectedEditHandle && this.selectedEditHandle !== editHandle) {
            this.doResetSelectedEditHandle();
        }
        this.hoveredEditHandle = null;
        this.selectedEditHandle = editHandle;
        this.selectedEditHandle.select();
        App.getTransformControls().attach(editHandle.getMesh());
        EventBus.notify('editHandleSelected', "viewport" /* EEnv.VIEWPORT */, this.selectedEditHandle);
    }
    resetSelected() {
        App.getHierarchy().viewportDeselect();
        this.doResetSelected();
    }
    resetSelectedEditHandle() {
        this.doResetSelectedEditHandle();
    }
    doResetSelected() {
        if (this.selectedObject) {
            this.selectedObject.resetSelect();
            this.selectedObject = null;
            App.getTransformControls().detach();
            EventBus.notify('objectUnselected', "all" /* EEnv.ALL */);
        }
    }
    doResetSelectedEditHandle() {
        if (this.selectedEditHandle) {
            this.selectedEditHandle.resetSelect();
            this.selectedEditHandle = null;
            App.getTransformControls().detach();
            EventBus.notify('editHandleUnselected', "all" /* EEnv.ALL */);
        }
    }
    //#region Tooltip
    showTooltip(object) {
        if (object instanceof VisualObject) {
            App.getTooltip().innerHTML = "<b>" + object.getName() + "</b></br><i>Type:</i> " + object.getType();
            App.getTooltip().style.display = 'block';
        }
        else if (object instanceof EditHandle) {
            App.getTooltip().innerHTML = "<b>Control Point - " + object.getIndex() + "</b></br><i>Object:</i> " + object.getParentObject().getName();
            App.getTooltip().style.display = 'block';
        }
    }
    hideTooltip() {
        App.getTooltip().style.display = 'none';
    }
    //#endregion
    //#region Private methods
    //find the first selectable object in the list of intersects
    findMesh(intersects) {
        for (const intersect of intersects) {
            if (!(intersect.object instanceof THREE.Mesh))
                continue;
            if (App.getObjectManager().selectable(intersect.object) || App.getObjectManager().isEditHandle(intersect.object)) { //selectable or isEditHandle
                return intersect.object;
            }
        }
        return null;
    }
}

export { SelectionManager };
