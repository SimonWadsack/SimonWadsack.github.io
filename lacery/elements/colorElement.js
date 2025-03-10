import { Color } from 'three';
import { LaceElement } from '../LaceElement.js';

class ColorElement extends LaceElement {
    obj;
    key;
    colorPicker;
    labelElement;
    constructor(label, obj, key, options = {}) {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        const colorPicker = document.createElement('sl-color-picker');
        colorPicker.format = 'rgb';
        colorPicker.noFormatToggle = true;
        colorPicker.swatches = ["#27ae60", "#2980b9", "#8e44ad", "#16a085", "#f39c12", "#d35400", "#c0392b", "#7f8c8d"];
        colorPicker.value = toRGB(obj[key]);
        colorPicker.addEventListener('sl-input', () => {
            obj[key] = toColor(colorPicker.value);
            this.changed();
        });
        const labelElement = document.createElement('label');
        labelElement.innerHTML = label;
        div.appendChild(labelElement);
        div.appendChild(colorPicker);
        super(label, div);
        this.obj = obj;
        this.key = key;
        this.colorPicker = colorPicker;
        this.labelElement = labelElement;
    }
    getObj() {
        return this.obj;
    }
    getKeys() {
        return [this.key];
    }
    update() {
        this.colorPicker.value = toRGB(this.obj[this.key]);
    }
    setSize(size) {
        this.colorPicker.size = size;
        this.labelElement.style.fontSize = size === 'small' ? 'var(--sl-input-label-font-size-small)' : size === 'medium' ? 'var(--sl-input-label-font-size-medium)' : 'var(--sl-input-label-font-size-large)';
    }
}
function toRGB(color) {
    return "#" + color.getHexString();
}
function toColor(rgb) {
    return new Color(rgb);
}

export { ColorElement };
