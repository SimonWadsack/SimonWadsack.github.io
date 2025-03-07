import { initScene, initGrid } from './core/scene.js';
import { ObjectManager } from './managers/objectManager.js';
import { CreationManager } from './managers/creationManager.js';
import { SelectionManager } from './managers/selectionManager.js';
import { EditManager } from './managers/editManager.js';
import { Lace } from './lacery/Lace.js';
import { NumberElement } from './lacery/elements/numberElement.js';
import { SliderElement } from './lacery/elements/sliderElement.js';
import { NumberSelectElement } from './lacery/elements/numberSelectElement.js';
import { TextSelectElement } from './lacery/elements/textSelectElement.js';
import { ColorElement } from './lacery/elements/colorElement.js';
import { Vec2Element } from './lacery/elements/vec2Element.js';
import { Vec3Element } from './lacery/elements/vec3Element.js';

let scene, camera, renderer, controls, grid, plane, objectManager, creationManager, selectionManager, editManager;
function init() {
    const viewport = document.getElementById('viewport');
    if (!viewport)
        return;
    const inspector = document.getElementById('inspector');
    if (!inspector)
        return;
    const hierarchy = document.getElementById('hierarchy');
    if (!hierarchy)
        return;
    ({ scene, camera, renderer, controls } = initScene(viewport));
    ({ grid, plane } = initGrid(scene));
    objectManager = new ObjectManager(scene, grid, plane);
    creationManager = new CreationManager(objectManager);
    selectionManager = new SelectionManager(scene, camera, objectManager, controls, renderer.domElement);
    selectionManager.getTransformControls();
    editManager = new EditManager();
    creationManager.createBasicBezierCurve();
    const bezierCurveObject = creationManager.createBasicBezierCurve();
    bezierCurveObject.moveZ(5);
    const bezierCurveObject2 = creationManager.createBasicBezierCurve();
    bezierCurveObject2.moveZ(-5);
    const lace = new Lace(inspector);
    lace.add(new NumberElement('X', grid.position, 'x'));
    lace.add(new SliderElement('Y', grid.position, 'y', { min: -10, max: 10, step: 0.5 }));
    lace.add(new NumberSelectElement('Z', grid.position, 'z', { 1: 'One', 2: 'Two', 3: 'Three' }));
    lace.add(new TextSelectElement('Z', grid.position, 'z', { '1': 'One', '2': 'Two', '3': 'Three' }));
    lace.add(new ColorElement('Color', grid.material, 'color'));
    lace.add(new ColorElement('Color2', grid.material, 'color'));
    lace.add(new Vec2Element('Position', grid.position, 'x', 'y', { yStep: 0.5 }));
    lace.add(new Vec3Element('Position', grid.position, 'x', 'y', 'z', { yStep: 0.5 }));
    renderer.setAnimationLoop(render);
}
function render() {
    renderer.render(scene, camera);
    controls.update();
    selectionManager.update();
    editManager.update();
}
init();
