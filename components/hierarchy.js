import { EventBus } from '../core/events.js';
import { HierarchyMenu } from './hierarchy/hierarchyMenu.js';
import { App } from '../core/app.js';

class Hierarchy {
    container;
    menu;
    tree;
    items;
    hoveredItem;
    selectedItem;
    constructor(container, options = {}) {
        const { darkMode = false } = options;
        this.items = new Map();
        this.hoveredItem = null;
        this.selectedItem = null;
        const div = document.createElement('div');
        div.className = 'hierarchy';
        //div.style.padding = '1em';
        div.style.border = 'solid 1px var(--sl-color-neutral-300)';
        div.style.borderRadius = 'var(--sl-border-radius-small)';
        div.style.backgroundColor = 'var(--sl-color-neutral-0)';
        div.style.height = '100%';
        div.style.overflow = 'auto';
        div.style.color = 'var(--sl-input-color) !important';
        if (darkMode) {
            div.classList.add('sl-theme-dark');
        }
        this.menu = new HierarchyMenu(div, this.selectionChangedUUID.bind(this), this.removeSelected.bind(this));
        this.tree = document.createElement('sl-tree');
        this.tree.selection = 'leaf';
        div.appendChild(this.tree);
        container.appendChild(div);
        this.container = div;
        this.tree.addEventListener('sl-selection-change', (event) => this.selectionChanged(event));
        this.container.addEventListener('mouseup', () => this.deselect());
        EventBus.subscribe('objectAdded', "general" /* EEnv.GENERAL */, (object) => this.addObject(object));
        //EventBus.subscribe('objectRemoved', (object: VisualObject) => this.removeObject(object));
        EventBus.subscribe('objectChanged', "general" /* EEnv.GENERAL */, () => this.updateHierarchy());
        EventBus.subscribe('objectNameChanged', "general" /* EEnv.GENERAL */, () => this.updateHierarchy());
    }
    updateHierarchy() {
        this.items.clear();
        this.tree.innerHTML = '';
        App.getObjectManager().getObjects().forEach(object => {
            this.addObject(object);
            if (object.getUUID() === this.hoveredItem) {
                this.viewportHover(object.getUUID());
            }
            if (object.getUUID() === this.selectedItem?.dataset.uuid) {
                this.viewportSelect(object.getUUID());
            }
        });
    }
    addObject(object) {
        const item = document.createElement('sl-tree-item');
        item.dataset.uuid = object.getUUID();
        item.classList.add('hierarchy-item');
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '10px';
        const icon = document.createElement('sl-icon');
        icon.name = 'bezier';
        div.appendChild(icon);
        const text = document.createElement('span');
        text.textContent = object.getName();
        div.appendChild(text);
        item.appendChild(div);
        const colorDiv = document.createElement('div');
        colorDiv.style.color = '#' + object.getColor().getHexString();
        colorDiv.style.marginRight = '20px';
        const color = document.createElement('sl-icon');
        color.name = 'circle-fill';
        colorDiv.appendChild(color);
        item.appendChild(colorDiv);
        item.addEventListener('mouseenter', () => this.hovered(object.getUUID()));
        item.addEventListener('mouseleave', () => this.dehovered(object.getUUID()));
        item.addEventListener('sl-expand', () => this.selectionChangedUUID(object.getUUID()));
        item.addEventListener('sl-collapse', () => this.selectionChangedUUID(object.getUUID()));
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
        const object = App.getObjectManager().getObjectByUUID(uuid);
        if (!object)
            return;
        this.hoveredItem = uuid;
        App.getSelectionManager().doHover(object);
    }
    viewportHover(uuid) {
        const item = this.items.get(uuid);
        if (item) {
            this.hoveredItem = uuid;
            item.classList.add('hover');
        }
    }
    dehovered(uuid) {
        const object = App.getObjectManager().getObjectByUUID(uuid);
        if (!object)
            return;
        this.hoveredItem = null;
        App.getSelectionManager().doResetHovered();
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
    selectionChangedUUID(uuid) {
        const item = this.items.get(uuid);
        if (item) {
            this.viewportSelect(uuid);
            this.selectionChanged(new CustomEvent('sl-selection-change', { detail: { selection: [item] } }));
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
        const object = App.getObjectManager().getObjectByUUID(uuid);
        if (object) {
            App.getSelectionManager().doSelect(object);
        }
    }
    removeSelected() {
        if (!this.selectedItem)
            return;
        const uuid = this.selectedItem.dataset.uuid;
        if (!uuid)
            return;
        const object = App.getObjectManager().getObjectByUUID(uuid);
        if (object) {
            this.selectedItem = null;
            App.getTransformControls().detach();
            this.removeObject(object);
            App.getObjectManager().removeObject(uuid);
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
        const object = App.getObjectManager().getObjectByUUID(uuid);
        if (object) {
            App.getSelectionManager().doResetSelected();
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
