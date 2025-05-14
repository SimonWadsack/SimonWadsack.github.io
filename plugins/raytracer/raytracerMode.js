import { ButtonElement, LabelElement, SliderElement } from 'lacery';
import { GroupControl } from '../../components/controls.js';
import { ObjectInspectorMode } from '../../components/inspectors/objectInspector.js';
import { EventBus } from '../../core/events.js';
import { App } from '../../core/app.js';
import { Raytracer } from './raytracer.js';

class RaytracerMode extends ObjectInspectorMode {
    params;
    raytraceButton;
    constructor() {
        const controls = new GroupControl();
        super('trending-up-down', false, controls, true);
        this.params = { width: 512, height: 512, bounces: 0, skybox: false };
        this.raytraceButton = new ButtonElement('Raytrace', this.startRaytracer.bind(this), { variant: 'primary', prefixIcon: 'play', iconLibrary: 'lucide' });
        EventBus.subscribe('dimensionSwitched', "all" /* EEnv.ALL */, () => {
            this.raytraceButton.setDisabled(App.dimension2D());
        });
    }
    build(tab) {
        tab.add(new LabelElement("Raytracer", { bold: true }));
        tab.add(new SliderElement("Width", this.params, 'width', { min: 128, max: 4096, step: 128 }));
        tab.add(new SliderElement("Height", this.params, 'height', { min: 128, max: 4096, step: 128 }));
        tab.add(new SliderElement("Bounces", this.params, 'bounces', { min: 0, max: 10, step: 1 }));
        //tab.add(new BooleanElement("Skybox", this.params, 'skybox'));
        tab.add(this.raytraceButton);
    }
    startRaytracer() {
        try {
            const task = Raytracer.prepareTask(this.params.width, this.params.height, this.params.bounces, this.params.skybox);
            Raytracer.execute(task);
        }
        catch (e) {
            console.error('Raytracer error:', e);
        }
    }
    select(object) { }
    deselect() { }
    objectChanged(object) { }
    inspectorChanged(object) { }
}

export { RaytracerMode };
