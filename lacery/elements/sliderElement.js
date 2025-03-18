import { LaceElement } from '../LaceElement.js';

class SliderElement extends LaceElement {
    obj;
    key;
    range;
    input;
    constructor(label, obj, key, options = {}) {
        const { help = "", min = 0, max = 100, step = 1 } = options;
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        const range = document.createElement('sl-range');
        range.label = label;
        range.helpText = help;
        range.min = min;
        range.max = max;
        range.step = step;
        range.value = obj[key];
        const input = document.createElement('sl-input');
        input.type = 'number';
        input.min = min;
        input.max = max;
        input.step = step;
        input.value = obj[key];
        range.addEventListener('sl-input', () => {
            obj[key] = range.value;
            input.value = range.value.toString();
            this.changed();
        });
        input.addEventListener('sl-input', () => {
            obj[key] = parseFloat(input.value);
            range.value = parseFloat(input.value);
            this.changed();
        });
        range.style.width = '60%';
        range.style.marginRight = '1em';
        input.style.width = '40%';
        div.appendChild(range);
        div.appendChild(input);
        super(label, div);
        this.obj = obj;
        this.key = key;
        this.range = range;
        this.input = input;
    }
    getObj() {
        return this.obj;
    }
    getKeys() {
        return [this.key];
    }
    update() {
        this.range.value = this.obj[this.key];
        this.input.value = this.obj[this.key].toString();
    }
    setSize(size) {
        this.input.size = size;
        this.range.style.setProperty('--thumb-size', size === 'small' ? '15px' : size === 'medium' ? '20px' : '25px');
        this.range.style.setProperty('--track-height', size === 'small' ? '5px' : size === 'medium' ? '6px' : '7px');
    }
}

export { SliderElement };
