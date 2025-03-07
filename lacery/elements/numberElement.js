import { LaceElement } from '../Lace.js';

class NumberElement extends LaceElement {
    obj;
    key;
    input;
    constructor(label, obj, key, options = {}) {
        const { help = "", step = 1 } = options;
        const input = document.createElement('sl-input');
        input.label = label;
        input.step = step;
        input.helpText = help;
        input.type = 'number';
        input.value = obj[key];
        input.addEventListener('sl-input', () => {
            obj[key] = parseFloat(input.value);
            this.changed();
        });
        super(label, input);
        this.obj = obj;
        this.key = key;
        this.input = input;
    }
    getObj() {
        return this.obj;
    }
    getKeys() {
        return [this.key];
    }
    update() {
        this.input.value = this.obj[this.key];
    }
    setSize(size) {
        this.input.size = size;
    }
}

export { NumberElement };
