import { LaceElement } from '../LaceElement.js';
import { GroupElement } from './groupElement.js';

class FolderElement extends LaceElement {
    details;
    lace;
    elements = [];
    brs = new Map();
    small;
    constructor(label, lace, options = {}) {
        const { darkMode = false, small = true } = options;
        const details = document.createElement('sl-details');
        details.summary = label;
        details.open = true;
        details.style.color = 'var(--sl-input-color) !important';
        if (darkMode) {
            details.classList.add('sl-theme-dark');
        }
        super(label, details);
        this.details = details;
        this.lace = lace;
        this.small = small;
    }
    add(element) {
        element.setSize(this.small ? 'small' : 'medium');
        this.lace.connect(element);
        const br = document.createElement('br');
        this.elements.push(element);
        this.brs.set(element, br);
        this.details.appendChild(element.element);
        this.details.appendChild(br);
    }
    addFolder(label, options = {}) {
        const folder = new FolderElement(label, this.lace, options);
        this.add(folder);
        return folder;
    }
    addGroup(options = {}) {
        const group = new GroupElement(this.lace, options);
        this.add(group);
        return group;
    }
    hide(element) {
        if (!this.elements.includes(element))
            return;
        if (element.element.dataset.display === undefined)
            element.element.dataset.display = element.element.style.display;
        element.element.style.display = 'none';
        const br = this.brs.get(element);
        if (br)
            br.style.display = 'none';
    }
    show(element) {
        if (!this.elements.includes(element))
            return;
        element.element.style.display = element.element.dataset.display || '';
        const br = this.brs.get(element);
        if (br)
            br.style.display = '';
    }
    getElements() {
        return this.elements;
    }
    getObj() { return null; }
    getKeys() { return []; }
    update() {
        this.elements.forEach(element => element.update());
    }
    setSize(size) { }
}

export { FolderElement };
