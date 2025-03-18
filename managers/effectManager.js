import { EffectComposer, RenderPass, OutputPass } from 'three/examples/jsm/Addons.js';
import { App } from '../core/app.js';

class EffectManager {
    constructor() {
        const composer = new EffectComposer(App.getRenderer());
        App.setEffectComposer(composer);
        composer.addPass(new RenderPass(App.getScene(), App.getCamera()));
        composer.addPass(new OutputPass());
    }
}

export { EffectManager };
