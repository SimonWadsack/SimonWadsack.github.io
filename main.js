import { initScene, initGrid, initTooltip } from './core/scene.js';
import { ObjectManager } from './managers/objectManager.js';
import { CreationManager } from './managers/creationManager.js';
import { SelectionManager } from './managers/selectionManager.js';
import { EditManager } from './managers/editManager.js';
import { Inspector } from './components/inspector.js';
import { Hierarchy } from './components/hierarchy.js';
import { App } from './core/app.js';
import { EffectManager } from './managers/effectManager.js';
import { registerIconLibrary } from '@shoelace-style/shoelace';

function init() {
    registerIconLibrary('lucide', {
        resolver: name => { console.log('resolving: ', name); return `https://cdn.jsdelivr.net/npm/lucide-static@0.482.0/icons/${name}.svg`; }
    });
    const viewportElement = document.getElementById('viewport');
    if (!viewportElement)
        return;
    const inspectorElement = document.getElementById('inspector');
    if (!inspectorElement)
        return;
    const hierarchyElement = document.getElementById('hierarchy');
    if (!hierarchyElement)
        return;
    initScene(viewportElement);
    initGrid();
    initTooltip(viewportElement);
    const objectManager = new ObjectManager();
    App.setObjectManager(objectManager);
    const creationManager = new CreationManager();
    App.setCreationManager(creationManager);
    const selectionManager = new SelectionManager();
    App.setSelectionManager(selectionManager);
    const editManager = new EditManager();
    App.setEditManager(editManager);
    const effectManager = new EffectManager();
    App.setEffectManager(effectManager);
    const hierarchy = new Hierarchy(hierarchyElement);
    App.setHierarchy(hierarchy);
    const inspector = new Inspector(inspectorElement);
    App.setInspector(inspector);
    render();
}
function render() {
    requestAnimationFrame(render);
    App.getEffectComposer().render();
    App.getOrbitControls().update();
    App.getSelectionManager().update();
}
init();
