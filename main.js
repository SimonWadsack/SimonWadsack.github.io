import { initScene, initGrid } from './core/scene.js';
import { ObjectManager } from './managers/objectManager.js';
import { CreationManager } from './managers/creationManager.js';
import { SelectionManager } from './managers/selectionManager.js';
import { EditManager } from './managers/editManager.js';
import { Inspector } from './components/inspector.js';
import { Hierarchy } from './components/hierarchy.js';

let scene, camera, renderer, controls, grid, plane, objectManager, creationManager, selectionManager;
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
    objectManager = new ObjectManager(scene, grid, plane);
    creationManager = new CreationManager(objectManager);
    selectionManager = new SelectionManager(scene, camera, objectManager, controls, renderer.domElement);
    selectionManager.getTransformControls();
    new EditManager();
    new Inspector(inspectorElement);
    new Hierarchy(hierarchyElement, objectManager, selectionManager);
    creationManager.createBasicBezierCurve();
    const bezierCurveObject = creationManager.createBasicBezierCurve();
    bezierCurveObject.moveZ(5);
    const bezierCurveObject2 = creationManager.createBasicBezierCurve();
    bezierCurveObject2.moveZ(-5);
    renderer.setAnimationLoop(render);
}
function render() {
    renderer.render(scene, camera);
    controls.update();
    selectionManager.update();
}
init();
