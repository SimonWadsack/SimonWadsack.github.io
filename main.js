import { initScene, initGrid, initTooltip } from './core/scene.js';
import { ObjectManager } from './managers/objectManager.js';
import { CreationManager } from './managers/creationManager.js';
import { SelectionManager } from './managers/selectionManager.js';
import { EditManager } from './managers/editManager.js';
import { Inspector } from './components/inspector.js';
import { Hierarchy } from './components/hierarchy.js';

let scene, camera, renderer, controls, grid, plane, tooltip, objectManager, creationManager, selectionManager;
function init() {
    const viewportElement = document.getElementById('viewport');
    if (!viewportElement)
        return;
    const inspectorElement = document.getElementById('inspector');
    if (!inspectorElement)
        return;
    const hierarchyElement = document.getElementById('hierarchy');
    if (!hierarchyElement)
        return;
    ({ scene, camera, renderer, controls } = initScene(viewportElement));
    ({ grid, plane } = initGrid(scene));
    tooltip = initTooltip(viewportElement);
    objectManager = new ObjectManager(scene, grid, plane);
    creationManager = new CreationManager(objectManager);
    selectionManager = new SelectionManager(scene, camera, objectManager, controls, renderer.domElement, tooltip);
    selectionManager.getTransformControls();
    new EditManager();
    new Inspector(inspectorElement, selectionManager);
    new Hierarchy(hierarchyElement, objectManager, selectionManager, creationManager);
    renderer.setAnimationLoop(render);
}
function render() {
    renderer.render(scene, camera);
    controls.update();
    selectionManager.update();
}
init();
