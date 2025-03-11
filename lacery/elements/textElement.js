import { LaceElement } from '../LaceElement.js';

class TextElement extends LaceElement {
    obj;
    key;
    input;
    constructor(label, obj, key, options = {}) {
        const { help = "" } = options;
        const input = document.createElement('sl-input');
        input.label = label;
        input.helpText = help;
        input.type = 'text';
        input.autocomplete = 'off';
        input.value = obj[key];
        input.addEventListener('sl-input', () => {
            obj[key] = input.value;
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

export { TextElement };
