import { LaceElement } from '../Lace.js';

class TextSelectElement extends LaceElement {
    obj;
    key;
    select;
    constructor(label, obj, key, selectOptions, options = {}) {
        const { help = "" } = options;
        if (!selectOptions[obj[key]])
            selectOptions[obj[key]] = "Original";
        const select = document.createElement('sl-select');
        select.label = label;
        select.helpText = help;
        select.placeholder = '-';
        for (const key in selectOptions) {
            const option = document.createElement('sl-option');
            option.value = key;
            option.textContent = selectOptions[key];
            select.appendChild(option);
        }
        select.defaultValue = obj[key].toString();
        select.addEventListener('sl-input', () => {
            obj[key] = select.value;
            this.changed();
        });
        super(label, select);
        this.obj = obj;
        this.key = key;
        this.select = select;
    }
    getObj() {
        return this.obj;
    }
    getKeys() {
        return [this.key];
    }
    update() {
        this.select.value = this.obj[this.key].toString();
    }
    setSize(size) {
        this.select.size = size;
    }
}

export { TextSelectElement };
