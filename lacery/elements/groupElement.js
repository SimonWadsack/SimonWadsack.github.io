import { LaceElement } from '../LaceElement.js';
import { FolderElement } from './folderElement.js';

class GroupElement extends LaceElement {
    container;
    lace;
    elements = [];
    brs = new Map();
    small;
    constructor(lace, options = {}) {
        const { small = true } = options;
        const div = document.createElement('div');
        div.style.color = 'var(--sl-input-color) !important';
        super("laceGroup", div);
        this.container = div;
        this.lace = lace;
        this.small = small;
    }
    add(element) {
        element.setSize(this.small ? 'small' : 'medium');
        this.lace.connect(element);
        element.registerUpdateCallback(() => { this.changed(); });
        if (this.elements.length > 0) {
            const br = document.createElement('br');
            this.brs.set(element, br);
            this.container.appendChild(br);
        }
        this.elements.push(element);
        this.container.appendChild(element.element);
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

export { GroupElement };
