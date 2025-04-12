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
import { IOManager } from './managers/ioManager.js';
import { Toolbar } from './components/toolbar.js';
import { InteractionsManager } from './managers/interactionsManager.js';
import { Controls } from './components/controls.js';
import { ExportManager } from './managers/exportManager.js';
import { sqrt } from 'mathjs';

function init() {
    registerIconLibrary('lucide', {
        resolver: (name) => `https://cdn.jsdelivr.net/npm/lucide-static@0.482.0/icons/${name}.svg`
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
    const ioManager = new IOManager();
    App.setIOManager(ioManager);
    const interactionsManager = new InteractionsManager();
    App.setInteractionsManager(interactionsManager);
    const exportManager = new ExportManager();
    App.setExportManager(exportManager);
    const controls = new Controls(viewportElement);
    App.setControls(controls);
    const hierarchy = new Hierarchy(hierarchyElement);
    App.setHierarchy(hierarchy);
    const inspector = new Inspector(inspectorElement);
    App.setInspector(inspector);
    const toolbar = new Toolbar(viewportElement);
    App.setToolbar(toolbar);
    App.getIOManager().loadSceneFromCache();
    console.log(sqrt(2));
    render();
}
function render() {
    requestAnimationFrame(render);
    App.getEffectComposer().render();
    App.getOrbitControls().update();
    App.getSelectionManager().update();
}
init();
