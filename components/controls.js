import { App } from '../core/app.js';
import { EventBus } from '../core/events.js';

class Controls {
    controls = [];
    details;
    constructor(container) {
        const div = document.createElement('div');
        div.className = 'controls';
        this.details = document.createElement('sl-details');
        this.details.open = !App.getIOManager().getFlagCache('controlsClosed');
        this.details.style.minWidth = '120px';
        this.details.summary = 'Controls';
        div.appendChild(this.details);
        container.appendChild(div);
        this.initControls();
        this.redraw();
        EventBus.subscribe('dimensionSwitched', "all" /* EEnv.ALL */, (is2D) => this.redraw());
        this.details.addEventListener('sl-after-show', () => App.getIOManager().setFlagCache('controlsClosed', false));
        this.details.addEventListener('sl-after-hide', () => App.getIOManager().setFlagCache('controlsClosed', true));
    }
    add(control) {
        if (this.controls.includes(control))
            return;
        this.controls.push(control);
        this.redraw();
    }
    remove(control) {
        const index = this.controls.indexOf(control);
        if (index !== -1) {
            this.controls.splice(index, 1);
            this.redraw();
        }
    }
    redraw() {
        this.details.innerHTML = '';
        this.controls.forEach(control => {
            const div = document.createElement('div');
            div.innerHTML = control.getHTML();
            this.details.appendChild(div);
        });
    }
    initControls() {
        const basicGroup = new GroupControl();
        basicGroup.add(new LabelControl('Viewport Controls', false));
        basicGroup.add(new BoolTextControl(App.dimension2D.bind(App), 'Press <b>D</b> to switch to <b>2D</b>.', 'Press <b>D</b> to switch to <b>3D</b>.'));
        basicGroup.add(new BoolTextControl(App.dimension2D.bind(App), 'Hold the <b>LMB</b> to <b>orbit</b> around the scene.', 'Hold the <b>LMB / RMB</b> to pan the camera.'));
        basicGroup.add(new BoolTextControl(App.dimension2D.bind(App), 'Hold the <b>RMB</b> (or shift + LMB) to <b>pan</b> the camera.', ''));
        basicGroup.add(new TextControl('<b>Scroll</b> the mouse wheel to <b>zoom</b> in and out.'));
        basicGroup.add(new TextControl('<b>Click</b> on an object to <b>select</b> it.'));
        this.add(basicGroup);
    }
}
class Control {
}
class LabelControl extends Control {
    text;
    breakLine;
    constructor(text, breakLine = true) {
        super();
        this.text = text;
        this.breakLine = breakLine;
    }
    getHTML() {
        const breakTag = this.breakLine ? '<br>' : '';
        return breakTag + `<strong>${this.text}</strong>`;
    }
}
class TextControl extends Control {
    text;
    constructor(text) {
        super();
        this.text = text;
    }
    getHTML() {
        return `<span>${this.text}</span>`;
    }
}
class BoolTextControl extends Control {
    bool;
    textFalse;
    textTrue;
    constructor(bool, textFalse, textTrue) {
        super();
        this.bool = bool;
        this.textFalse = textFalse;
        this.textTrue = textTrue;
    }
    getHTML() {
        return this.bool() ? `<span>${this.textTrue}</span>` : `<span>${this.textFalse}</span>`;
    }
}
class KeyControl extends Control {
    key;
    value;
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }
    getHTML() {
        return `<span><strong>${this.key}</strong>: <span>${this.value}</span></span>`;
    }
}
class GroupControl extends Control {
    controls = [];
    constructor() {
        super();
    }
    add(control) {
        this.controls.push(control);
    }
    getHTML() {
        let html = '<div>';
        this.controls.forEach(control => {
            html += `<div>${control.getHTML()}</div>`;
        });
        html += '</div>';
        return html;
    }
}

export { BoolTextControl, Controls, GroupControl, KeyControl, LabelControl, TextControl };
