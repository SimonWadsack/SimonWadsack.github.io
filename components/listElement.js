import { LaceElement } from 'lacery';

class ListElement extends LaceElement {
    container;
    elements;
    changeCallback;
    addCallback;
    removeCallback;
    divElements = [];
    editorElements = [];
    constructor(label, elements, changeCallback, addCallback, removeCallback, options = {}) {
        const { scrollFix = false } = options;
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.width = '100%';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        if (scrollFix)
            div.style.maxHeight = 'calc(50vh - 2rem)';
        super(label, div);
        this.container = div;
        this.label = label;
        this.elements = elements;
        this.changeCallback = changeCallback;
        this.addCallback = addCallback;
        this.removeCallback = removeCallback;
        this.drawList();
    }
    drawList() {
        this.container.innerHTML = "";
        const label = document.createElement('span');
        label.innerHTML = this.label;
        label.style.width = '100%';
        label.style.textAlign = 'left';
        label.style.marginBottom = '0.5em';
        label.style.fontSize = "var(--sl-input-label-font-size-small)";
        this.container.appendChild(label);
        this.elements.forEach((element, index) => {
            this.drawElement(index);
        });
        const buttons = document.createElement('sl-button-group');
        buttons.style.width = '100%';
        const add = document.createElement('sl-button');
        add.innerText = "Add";
        add.size = "small";
        add.variant = 'success';
        add.outline = true;
        add.style.width = '50%';
        add.onclick = () => this.addCallback();
        const remove = document.createElement('sl-button');
        remove.innerText = "Remove";
        remove.size = "small";
        remove.variant = 'danger';
        remove.outline = true;
        remove.style.width = '50%';
        remove.onclick = () => this.removeCallback();
        buttons.appendChild(add);
        buttons.appendChild(remove);
        this.container.appendChild(document.createElement('br'));
        this.container.appendChild(buttons);
        this.container.appendChild(document.createElement('br'));
    }
    changedIndex(index) {
        this.changeCallback(index);
        this.changed();
    }
    updateIndex(index) {
        this.editorElements[index].forEach(element => element.update());
    }
    getObj() {
        return null;
    }
    getKeys() {
        return [];
    }
    update() {
        this.drawNewElements();
        this.removeOldElements();
        this.editorElements.forEach((element, index) => {
            element.forEach(e => e.update());
        });
    }
    setSize(size) { }
    drawNewElements() {
        const count = this.elements.length - this.divElements.length;
        for (let i = 0; i < count; i++) {
            this.drawElement(this.elements.length - count + i);
        }
    }
    removeOldElements() {
        const count = this.divElements.length - this.elements.length;
        for (let i = 0; i < count; i++) {
            this.divElements.pop().remove();
        }
    }
    drawElement(index) {
        const div = document.createElement('div');
        div.classList.add('list-item');
        div.style.width = '100%';
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.padding = '0.5em';
        const text = document.createElement('span');
        text.innerHTML = "<i>" + (index + 1).toString() + "</i>: ";
        text.style.width = '20%';
        text.style.textAlign = 'center';
        text.style.marginRight = '1em';
        div.appendChild(text);
        const editor = document.createElement('div');
        editor.style.display = 'flex';
        editor.style.flexDirection = 'column';
        editor.style.minWidth = '0';
        editor.style.flexGrow = '1';
        this.editorElements[index] = [];
        var elementIndex = 0;
        const element = this.elements[index];
        element.getEditor().forEach(element => {
            this.editorElements[index].push(element);
            element.registerUpdateCallback(() => this.changedIndex(index));
            element.setSize('small');
            if (elementIndex > 0) {
                const br = document.createElement('br');
                editor.appendChild(br);
            }
            editor.appendChild(element.element);
            elementIndex++;
        });
        div.appendChild(editor);
        this.divElements.push(div);
        this.container.appendChild(div);
    }
}
class LaceListElement {
}

export { LaceListElement, ListElement };
