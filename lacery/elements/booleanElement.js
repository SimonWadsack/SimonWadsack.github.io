import { LaceElement } from '../LaceElement.js';

class BooleanElement extends LaceElement {
    obj;
    key;
    checkbox;
    constructor(label, obj, key, options = {}) {
        const { help = "" } = options;
        const checkbox = document.createElement('sl-checkbox');
        checkbox.textContent = label;
        checkbox.helpText = help;
        checkbox.checked = obj[key];
        checkbox.addEventListener('sl-change', () => {
            obj[key] = checkbox.checked;
            this.changed();
        });
        super(label, checkbox);
        this.obj = obj;
        this.key = key;
        this.checkbox = checkbox;
    }
    getObj() {
        return this.obj;
    }
    getKeys() {
        return [this.key];
    }
    update() {
        this.checkbox.checked = this.obj[this.key];
    }
    setSize(size) {
        this.checkbox.size = size;
    }
}

export { BooleanElement };
