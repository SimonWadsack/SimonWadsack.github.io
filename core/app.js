import { Color } from 'three';
import { EventBus } from './events.js';
import { getModeBackgroundColor } from './vars.js';

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
    static ambientLight;
    static directionalLight;
    static grid;
    static plane;
    static tooltip;
    static objectManager;
    static creationManager;
    static selectionManager;
    static editManager;
    static effectManager;
    static ioManager;
    static interactionsManager;
    static exportManager;
    static inspector;
    static hierarchy;
    static toolbar;
    static controls;
    static isOrbitingBool = false;
    static isDraggingBool = false;
    static is2D = false;
    static isDarkMode = false;
    static dimension2D() {
        return this.is2D;
    }
    static switchDimension() {
        if (this.is2D) {
            this.is2D = false;
            this.oTransformControls.detach();
            this.orbitControls.enabled = true;
            this.oOrbitControls.enabled = false;
            this.directionalLight.position.set(10, 25, 0);
            this.directionalLight.target.position.set(0, 0, 0);
        }
        else {
            this.is2D = true;
            this.transformControls.detach();
            this.orbitControls.enabled = false;
            this.oOrbitControls.enabled = true;
            this.directionalLight.position.set(0, 100, 0);
            this.directionalLight.target.position.set(0, 0, 0);
        }
        App.getEffectManager().setupRenderPass();
        App.getSelectionManager().doResetSelectedEditHandle();
        EventBus.notify('dimensionSwitched', "all" /* EEnv.ALL */, this.is2D);
    }
    static darkMode() {
        return this.isDarkMode;
    }
    static setMode(darkMode = false) {
        const app = document.getElementById('app');
        if (!app)
            return;
        if (darkMode) {
            this.isDarkMode = true;
            app.classList.add('sl-theme-dark');
        }
        else {
            this.isDarkMode = false;
            app.classList.remove('sl-theme-dark');
        }
        App.getScene().background = new Color(getModeBackgroundColor());
        App.getIOManager().setFlagCache('darkMode', this.isDarkMode);
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
    static onOrbitControlsChange(callback) {
        this.orbitControls.addEventListener('change', () => {
            if (!this.is2D)
                callback();
        });
        this.oOrbitControls.addEventListener('change', () => {
            if (this.is2D)
                callback();
        });
    }
    static onTransformControlsChange(callback) {
        this.transformControls.addEventListener('change', () => {
            if (!this.is2D)
                callback();
        });
        this.oTransformControls.addEventListener('change', () => {
            if (this.is2D)
                callback();
        });
    }
    static onControlsChange(callback) {
        this.onOrbitControlsChange(callback);
        this.onTransformControlsChange(callback);
        EventBus.subscribe('dimensionSwitched', "all" /* EEnv.ALL */, () => { callback(); });
    }
    static noScroll() {
        this.orbitControls.enableZoom = false;
        this.oOrbitControls.enableZoom = false;
    }
    static scroll() {
        this.orbitControls.enableZoom = true;
        this.oOrbitControls.enableZoom = true;
    }
    static getTransformControls() {
        return this.is2D ? this.oTransformControls : this.transformControls;
    }
    static getAmbientLight() {
        return this.ambientLight;
    }
    static getDirectionalLight() {
        return this.directionalLight;
    }
    static setupScene(scene, pCamera, oCamera, renderer, controls, oControls, transformControls, oTransformControls, ambientLight, directionalLight) {
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
        this.ambientLight = ambientLight;
        this.directionalLight = directionalLight;
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
    static getIOManager() {
        return this.ioManager;
    }
    static setIOManager(ioManager) {
        this.ioManager = ioManager;
    }
    static getInteractionsManager() {
        return this.interactionsManager;
    }
    static setInteractionsManager(interactionsManager) {
        this.interactionsManager = interactionsManager;
    }
    static getExportManager() {
        return this.exportManager;
    }
    static setExportManager(exportManager) {
        this.exportManager = exportManager;
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
    static getToolbar() {
        return this.toolbar;
    }
    static setToolbar(toolbar) {
        this.toolbar = toolbar;
    }
    static getControls() {
        return this.controls;
    }
    static setControls(controls) {
        this.controls = controls;
    }
    static isOrbiting() {
        return this.isOrbitingBool;
    }
    static isDragging() {
        return this.isDraggingBool;
    }
    // #region Default Image
    static getDefaultImage() {
        const image = new Image();
        image.width = 1;
        image.height = 1;
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, 1, 1);
            image.src = canvas.toDataURL();
        }
        return image;
    }
}

export { App };
