import { LaceElement } from '../Lace.js';

class Vec2Element extends LaceElement {
    obj;
    xKey;
    yKey;
    xInput;
    yInput;
    constructor(label, obj, xKey, yKey, options = {}) {
        const { help = "", xStep = 1, yStep = 1 } = options;
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        const xInput = document.createElement('sl-input');
        xInput.type = 'number';
        xInput.label = label;
        xInput.helpText = help;
        xInput.step = xStep;
        xInput.value = obj[xKey];
        const yInput = document.createElement('sl-input');
        yInput.type = 'number';
        yInput.label = " ";
        yInput.step = yStep;
        yInput.value = obj[yKey];
        xInput.addEventListener('sl-input', () => {
            obj[xKey] = parseFloat(xInput.value);
            this.changed();
        });
        yInput.addEventListener('sl-input', () => {
            obj[yKey] = parseFloat(yInput.value);
            this.changed();
        });
        xInput.style.width = '50%';
        xInput.style.marginRight = '1em';
        yInput.style.width = '50%';
        div.appendChild(xInput);
        div.appendChild(yInput);
        super(label, div);
        this.obj = obj;
        this.xKey = xKey;
        this.yKey = yKey;
        this.xInput = xInput;
        this.yInput = yInput;
    }
    getObj() {
        return this.obj;
    }
    getKeys() {
        return [this.xKey, this.yKey];
    }
    update() {
        this.xInput.value = this.obj[this.xKey];
        this.yInput.value = this.obj[this.yKey];
    }
    setSize(size) {
        this.xInput.size = size;
        this.yInput.size = size;
    }
}

export { Vec2Element };
