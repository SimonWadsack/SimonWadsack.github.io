class App {
    static scene;
    static pCamera;
    static renderer;
    static orbitControls;
    static grid;
    static plane;
    static tooltip;
    static objectManager;
    static creationManager;
    static selectionManager;
    static transformControls;
    static editManager;
    static inspector;
    static hierarchy;
    static getScene() {
        return this.scene;
    }
    static getCamera() {
        return this.pCamera;
    }
    static getRenderer() {
        return this.renderer;
    }
    static getOrbitControls() {
        return this.orbitControls;
    }
    static setupScene(scene, camera, renderer, controls) {
        this.scene = scene;
        this.pCamera = camera;
        this.renderer = renderer;
        this.orbitControls = controls;
    }
    static getGrid() {
        return this.grid;
    }
    static getPlane() {
        return this.plane;
    }
    static setupGrid(grid, plane) {
        this.grid = grid;
        this.plane = plane;
    }
    static getTooltip() {
        return this.tooltip;
    }
    static setTooltip(tooltip) {
        this.tooltip = tooltip;
    }
    static getObjectManager() {
        return this.objectManager;
    }
    static setObjectManager(objectManager) {
        this.objectManager = objectManager;
    }
    static getCreationManager() {
        return this.creationManager;
    }
    static setCreationManager(creationManager) {
        this.creationManager = creationManager;
    }
    static getSelectionManager() {
        return this.selectionManager;
    }
    static setSelectionManager(selectionManager) {
        this.selectionManager = selectionManager;
    }
    static getTransformControls() {
        return this.transformControls;
    }
    static setTransformControls(transformControls) {
        this.transformControls = transformControls;
    }
    static getEditManager() {
        return this.editManager;
    }
    static setEditManager(editManager) {
        this.editManager = editManager;
    }
    static getInspector() {
        return this.inspector;
    }
    static setInspector(inspector) {
        this.inspector = inspector;
    }
    static getHierarchy() {
        return this.hierarchy;
    }
    static setHierarchy(hierarchy) {
        this.hierarchy = hierarchy;
    }
}

export { App };
