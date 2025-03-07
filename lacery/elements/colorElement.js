import { LaceElement } from '../Lace.js';

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
    return `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
}
function toColor(rgb) {
    const [r, g, b] = rgb.replace('rgb', '').replaceAll('(', '').replace(')', '').split(',').map((c) => parseFloat(c));
    return { r: r / 255, g: g / 255, b: b / 255, isColor: true };
}

export { ColorElement };
