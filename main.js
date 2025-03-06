import { initScene, initGrid } from './core/scene.js';
import { ObjectManager } from './managers/objectManager.js';
import { CreationManager } from './managers/creationManager.js';
import { SelectionManager } from './managers/selectionManager.js';
import { EditManager } from './managers/editManager.js';

let scene, camera, renderer, controls, grid, plane, objectManager, creationManager, selectionManager, editManager;

function init(){
    const viewport = document.getElementById('viewport');
    document.getElementById('inspector');
    document.getElementById('hierarchy');

    ({scene, camera, renderer, controls} = initScene(viewport));

    ({grid, plane} = initGrid(scene));

    objectManager = new ObjectManager(scene, grid, plane);

    creationManager = new CreationManager(objectManager);

    selectionManager = new SelectionManager(scene, camera, objectManager, renderer.domElement);
    selectionManager.init(controls);

    editManager = new EditManager(objectManager);

    creationManager.createBasicBezierCurve();
    const bezierCurveObject = creationManager.createBasicBezierCurve();
    bezierCurveObject.moveZ(5);
    const bezierCurveObject2 = creationManager.createBasicBezierCurve();
    bezierCurveObject2.moveZ(-5);

    renderer.setAnimationLoop(render);
}

function render(){
    renderer.render(scene, camera);
    controls.update();
    selectionManager.update();
    editManager.update();
}

init();
