class App {
    static scene;
    static pCamera;
    static oCamera;
    static renderer;
    static effectComposer;
    static orbitControls;
    static oOrbitControls;
    static transformControls;
    static oTransformControls;
    static grid;
    static plane;
    static tooltip;
    static objectManager;
    static creationManager;
    static selectionManager;
    static editManager;
    static effectManager;
    static inspector;
    static hierarchy;
    static isOrbitingBool = false;
    static isDraggingBool = false;
    static is2D = false;
    static switchDimension() {
        if (this.is2D) {
            this.is2D = false;
            this.oTransformControls.detach();
            this.orbitControls.enabled = true;
            this.oOrbitControls.enabled = false;
        }
        else {
            this.is2D = true;
            this.transformControls.detach();
            this.orbitControls.enabled = false;
            this.oOrbitControls.enabled = true;
        }
        App.getEffectManager().setupRenderPass();
        App.getSelectionManager().doResetSelectedEditHandle();
    }
    static getScene() {
        return this.scene;
    }
    static getCamera() {
        return this.is2D ? this.oCamera : this.pCamera;
    }
    static getRenderer() {
        return this.renderer;
    }
    static getOrbitControls() {
        return this.is2D ? this.oOrbitControls : this.orbitControls;
    }
    static getTransformControls() {
        return this.is2D ? this.oTransformControls : this.transformControls;
    }
    static setupScene(scene, pCamera, oCamera, renderer, controls, oControls, transformControls, oTransformControls) {
        this.scene = scene;
        this.pCamera = pCamera;
        this.oCamera = oCamera;
        this.renderer = renderer;
        this.orbitControls = controls;
        this.orbitControls.addEventListener('start', () => this.isOrbitingBool = true);
        this.orbitControls.addEventListener('end', () => this.isOrbitingBool = false);
        this.oOrbitControls = oControls;
        this.oOrbitControls.addEventListener('start', () => this.isOrbitingBool = true);
        this.oOrbitControls.addEventListener('end', () => this.isOrbitingBool = false);
        this.transformControls = transformControls;
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
            this.isDraggingBool = event.value;
        });
        this.scene.add(this.transformControls.getHelper());
        this.oTransformControls = oTransformControls;
        this.oTransformControls.addEventListener('dragging-changed', (event) => {
            this.oOrbitControls.enabled = !event.value;
            this.isDraggingBool = event.value;
        });
        this.scene.add(this.oTransformControls.getHelper());
    }
    static getEffectComposer() {
        return this.effectComposer;
    }
    static setEffectComposer(effectComposer) {
        this.effectComposer = effectComposer;
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
    static getEditManager() {
        return this.editManager;
    }
    static setEditManager(editManager) {
        this.editManager = editManager;
    }
    static getEffectManager() {
        return this.effectManager;
    }
    static setEffectManager(effectManager) {
        this.effectManager = effectManager;
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
    static isOrbiting() {
        return this.isOrbitingBool;
    }
    static isDragging() {
        return this.isDraggingBool;
    }
}

export { App };
