import { FolderElement } from './elements/folderElement.js';
import 'three';
import { GroupElement } from './elements/groupElement.js';

class Lace {
    container;
    elements = [];
    brs = new Map();
    small;
    constructor(container, options = {}) {
        const { darkMode = false, small = true } = options;
        this.small = small;
        const div = document.createElement('div');
        div.className = 'lace';
        div.style.padding = '1em';
        div.style.border = 'solid 1px var(--sl-color-neutral-300)';
        div.style.borderRadius = 'var(--sl-border-radius-small)';
        div.style.backgroundColor = 'var(--sl-color-neutral-0)';
        div.style.height = '100%';
        div.style.overflow = 'auto';
        div.style.color = 'var(--sl-input-color) !important';
        if (darkMode) {
            div.classList.add('sl-theme-dark');
        }
        container.appendChild(div);
        this.container = div;
    }
    add(element) {
        element.setSize(this.small ? 'small' : 'medium');
        this.connect(element);
        const br = document.createElement('br');
        this.elements.push(element);
        this.brs.set(element, br);
        this.container.appendChild(element.element);
        this.container.appendChild(br);
    }
    addFolder(label, options = {}) {
        const folder = new FolderElement(label, this, options);
        this.add(folder);
        return folder;
    }
    addGroup(options = {}) {
        const group = new GroupElement(this, options);
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
    hideAll() {
        for (const element of this.elements) {
            this.hide(element);
        }
    }
    show(element) {
        if (!this.elements.includes(element))
            return;
        element.element.style.display = element.element.dataset.display || '';
        const br = this.brs.get(element);
        if (br)
            br.style.display = '';
    }
    showAll() {
        for (const element of this.elements) {
            this.show(element);
        }
    }
    connect(element) {
        if (element instanceof FolderElement)
            return;
        if (element instanceof GroupElement)
            return;
        const sameKeyElements = this.findSameObjectAndKeyElements(element);
        for (const sameKeyElement of sameKeyElements) {
            sameKeyElement.registerUpdateCallback(() => element.update());
            element.registerUpdateCallback(() => sameKeyElement.update());
        }
    }
    findSameObjectAndKeyElements(element) {
        var foundElements = [];
        var workingElements = this.elements.slice();
        while (workingElements.length > 0) {
            const currentElement = workingElements.shift();
            if (currentElement === undefined)
                break;
            if (currentElement instanceof FolderElement) {
                workingElements.push(...currentElement.getElements());
            }
            else {
                if (element.getObj() === currentElement.getObj()) {
                    const keys = element.getKeys();
                    for (const key of keys) {
                        if (currentElement.getKeys().includes(key)) {
                            foundElements.push(currentElement);
                        }
                    }
                }
            }
        }
        return foundElements;
    }
}

export { Lace };
