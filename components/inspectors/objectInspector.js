import { App } from '../../core/app.js';
import { EventBus } from '../../core/events.js';
import { GroupControl, LabelControl, KeyControl } from '../controls.js';

class ObjectInspector {
    name;
    lace;
    modes;
    currentObject;
    currentMode;
    tab;
    controls;
    constructor(name, lace, modes) {
        this.name = name;
        this.lace = lace;
        this.modes = modes;
        this.currentObject = null;
        this.currentMode = -1;
        this.controls = new GroupControl();
        this.controls.add(new LabelControl(name));
        this.controls.add(new KeyControl('Q', 'Switch between modes.'));
        App.getControls().add(this.controls);
        App.getInteractionsManager().addKeydown('q', () => {
            if (this.currentObject === null || this.currentMode === -1)
                return;
            const newMode = (this.currentMode + 1) % this.modes.length;
            this.showTab(newMode);
            this.currentObject.setMode(newMode);
        });
        this.tab = lace.addTab({ vertical: true, onTabChange: () => EventBus.notify('inspectorTabChanged', "inspector" /* EEnv.INSPECTOR */) });
        modes.forEach((mode, index) => {
            if (mode.disableEditing && mode.objectMode)
                console.error('Object mode cannot disable editing.');
            const newTab = this.tab.addTab(`Tab-${index}`, mode.getIcon(), "lucide");
            mode.build(newTab);
            newTab.registerOnSelected(() => {
                this.modeSelected(index);
                this.resetControls();
                App.getControls().add(mode.getControls());
            });
            newTab.registerOnDeSelected(() => {
                this.modeDeselected(index);
                this.resetControls();
            });
        });
        this.tab.onChange(() => this.inspectorChanged());
        this.hideInspector();
    }
    select(object) {
        this.lace.hideAll();
        this.currentObject = object;
        this.modes.forEach(mode => mode.select(object));
        this.objectChanged();
        const mode = object.getMode();
        this.currentMode = mode;
        this.modes[mode].setActive(true);
        this.showInspector();
        this.showTab(mode);
    }
    deselect() {
        this.hideInspector();
        this.modes.forEach(mode => mode.deselect());
        this.modes[this.currentMode].setActive(false);
        this.currentObject = null;
    }
    objectChanged() {
        if (this.currentObject === null || this.currentMode === -1)
            return;
        this.modes[this.currentMode].objectChanged(this.currentObject);
        this.updateTab();
    }
    inspectorChanged() {
        if (this.currentObject === null || this.currentMode === -1)
            return;
        this.modes[this.currentMode].inspectorChanged(this.currentObject);
        EventBus.notify('objectChanged', "inspector" /* EEnv.INSPECTOR */);
    }
    modeSelected(index) {
        if (this.currentObject === null || index >= this.modes.length)
            return;
        if (this.modes[index].objectMode)
            this.enableObjectMode(this.currentObject);
        if (this.modes[index].disableEditing)
            App.getSelectionManager().disableEditing();
        else
            App.getSelectionManager().enableEditing();
        this.currentObject.setMode(index);
        this.currentMode = index;
        this.modes[index].setActive(true);
        this.objectChanged();
    }
    modeDeselected(index) {
        if (index >= this.modes.length)
            return;
        if (this.modes[index].objectMode)
            this.disableObjectMode();
        App.getSelectionManager().enableEditing();
        this.modes[index].setActive(false);
    }
    showTab(index) {
        this.tab.show(`Tab-${index}`);
    }
    showInspector() {
        this.lace.show(this.tab);
        App.getControls().add(this.controls);
    }
    hideInspector() {
        this.lace.hide(this.tab);
        this.resetControls();
        App.getControls().remove(this.controls);
    }
    updateTab() {
        this.tab.update();
    }
    resetControls() {
        this.modes.forEach(mode => App.getControls().remove(mode.getControls()));
    }
    enableObjectMode(object) {
        App.getTransformControls().attach(object.getMesh());
        App.getSelectionManager().disableEditing();
    }
    disableObjectMode() {
        App.getTransformControls().detach();
        App.getSelectionManager().enableEditing();
    }
}
class ObjectInspectorMode {
    icon;
    objectMode;
    controls;
    disableEditing;
    active = false;
    constructor(icon, objectMode, controls, disableEditing = false) {
        this.icon = icon;
        this.objectMode = objectMode;
        this.controls = controls;
        this.disableEditing = disableEditing;
    }
    getIcon() {
        return this.icon;
    }
    getControls() {
        return this.controls;
    }
    setActive(active) {
        this.active = active;
    }
}

export { ObjectInspector, ObjectInspectorMode };
