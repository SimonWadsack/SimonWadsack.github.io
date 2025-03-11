import { LaceElement } from '../LaceElement.js';

class Vec3Element extends LaceElement {
    obj;
    xKey;
    yKey;
    zKey;
    xInput;
    yInput;
    zInput;
    constructor(label, obj, xKey, yKey, zKey, options = {}) {
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
        const zInput = document.createElement('sl-input');
        zInput.type = 'number';
        zInput.label = " ";
        zInput.step = yStep;
        zInput.value = obj[zKey];
        xInput.addEventListener('sl-input', () => {
            obj[xKey] = isNaN(parseFloat(xInput.value)) ? 0 : parseFloat(xInput.value);
            this.changed();
        });
        yInput.addEventListener('sl-input', () => {
            obj[yKey] = isNaN(parseFloat(yInput.value)) ? 0 : parseFloat(yInput.value);
            this.changed();
        });
        zInput.addEventListener('sl-input', () => {
            obj[zKey] = isNaN(parseFloat(zInput.value)) ? 0 : parseFloat(zInput.value);
            this.changed();
        });
        xInput.style.width = '30%';
        yInput.style.width = '30%';
        zInput.style.width = '30%';
        div.appendChild(xInput);
        div.appendChild(yInput);
        div.appendChild(zInput);
        super(label, div);
        this.obj = obj;
        this.xKey = xKey;
        this.yKey = yKey;
        this.zKey = zKey;
        this.xInput = xInput;
        this.yInput = yInput;
        this.zInput = zInput;
    }
    getObj() {
        return this.obj;
    }
    getKeys() {
        return [this.xKey, this.yKey, this.zKey];
    }
    update() {
        this.xInput.value = this.obj[this.xKey];
        this.yInput.value = this.obj[this.yKey];
        this.zInput.value = this.obj[this.zKey];
    }
    setSize(size) {
        this.xInput.size = size;
        this.yInput.size = size;
        this.zInput.size = size;
    }
}

export { Vec3Element };
