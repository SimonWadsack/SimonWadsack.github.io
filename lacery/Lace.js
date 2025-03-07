class LaceElement {
    label;
    element;
    onChangeCallback = () => { };
    updateCallbacks = [];
    constructor(label, element) {
        this.label = label;
        this.element = element;
    }
    onChange(callback) {
        this.onChangeCallback = callback;
        return this;
    }
    changed() {
        this.onChangeCallback();
        for (const callback of this.updateCallbacks) {
            callback();
        }
    }
    registerUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
    }
}
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
        const sameKeyElements = this.findSameObjectAndKeyElements(element);
        for (const sameKeyElement of sameKeyElements) {
            sameKeyElement.registerUpdateCallback(() => element.update());
            element.registerUpdateCallback(() => sameKeyElement.update());
        }
        const br = document.createElement('br');
        this.elements.push(element);
        this.brs.set(element, br);
        this.container.appendChild(element.element);
        this.container.appendChild(br);
    }
    findSameObjectAndKeyElements(element) {
        return this.elements.filter(e => e.getObj() === element.getObj() && e.getKeys().some(key => element.getKeys().includes(key)));
    }
}

export { Lace, LaceElement };
