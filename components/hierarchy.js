import { EventBus } from '../core/events.js';

class Hierarchy {
    container;
    objectManager;
    selectionManager;
    tree;
    items;
    hoveredItem;
    selectedItem;
    constructor(container, objectManager, selectionManager, options = {}) {
        const { darkMode = false } = options;
        this.objectManager = objectManager;
        this.selectionManager = selectionManager;
        this.items = new Map();
        this.hoveredItem = null;
        this.selectedItem = null;
        this.selectionManager.registerHierachy(this);
        const div = document.createElement('div');
        div.className = 'hierarchy';
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
        this.tree = document.createElement('sl-tree');
        this.tree.selection = 'leaf';
        div.appendChild(this.tree);
        container.appendChild(div);
        this.container = div;
        this.tree.addEventListener('sl-selection-change', (event) => this.selectionChanged(event));
        this.container.addEventListener('mouseup', () => this.deselect());
        EventBus.subscribe('objectAdded', (object) => this.addObject(object));
        EventBus.subscribe('objectRemoved', (object) => this.removeObject(object));
        EventBus.subscribe('objectChanged', () => this.updateHierarchy());
    }
    updateHierarchy() {
        this.items.clear();
        this.tree.innerHTML = '';
        this.objectManager.getObjects().forEach(object => this.addObject(object));
    }
    addObject(object) {
        const item = document.createElement('sl-tree-item');
        item.dataset.uuid = object.getUUID();
        item.classList.add('hierarchy-item');
        const icon = document.createElement('sl-icon');
        icon.name = 'bezier';
        item.appendChild(icon);
        const text = document.createElement('span');
        text.textContent = object.getName();
        item.appendChild(text);
        item.addEventListener('mouseenter', () => this.hovered(object.getUUID()));
        item.addEventListener('mouseleave', () => this.dehovered(object.getUUID()));
        this.items.set(object.getUUID(), item);
        this.tree.appendChild(item);
    }
    removeObject(object) {
        const item = this.items.get(object.getUUID());
        if (item) {
            this.tree.removeChild(item);
            this.items.delete(object.getUUID());
        }
    }
    hovered(uuid) {
        const object = this.objectManager.getObjectByUUID(uuid);
        if (!object)
            return;
        this.hoveredItem = uuid;
        this.selectionManager.doHover(object);
    }
    viewportHover(uuid) {
        const item = this.items.get(uuid);
        if (item) {
            this.hoveredItem = uuid;
            item.classList.add('hover');
        }
    }
    dehovered(uuid) {
        const object = this.objectManager.getObjectByUUID(uuid);
        if (!object)
            return;
        this.hoveredItem = null;
        this.selectionManager.doResetHovered();
    }
    viewportDehover() {
        const uuid = this.hoveredItem;
        if (!uuid)
            return;
        const item = this.items.get(uuid);
        if (item) {
            this.hoveredItem = null;
            item.classList.remove('hover');
        }
    }
    selectionChanged(event) {
        const item = event.detail.selection[0];
        if (!item)
            return;
        this.selectedItem = item;
        const uuid = item.dataset.uuid;
        if (!uuid)
            return;
        const object = this.objectManager.getObjectByUUID(uuid);
        if (object) {
            this.selectionManager.doSelect(object);
        }
    }
    viewportSelect(uuid) {
        const item = this.items.get(uuid);
        if (item) {
            if (this.selectedItem)
                this.selectedItem.selected = false;
            this.selectedItem = item;
            item.selected = true;
        }
    }
    deselect() {
        if (!this.selectedItem)
            return;
        this.selectedItem.selected = false;
        const uuid = this.selectedItem.dataset.uuid;
        if (!uuid)
            return;
        const object = this.objectManager.getObjectByUUID(uuid);
        if (object) {
            this.selectionManager.doResetSelected();
        }
        this.selectedItem = null;
    }
    viewportDeselect() {
        if (!this.selectedItem)
            return;
        this.selectedItem.selected = false;
        this.selectedItem = null;
    }
}

export { Hierarchy };
