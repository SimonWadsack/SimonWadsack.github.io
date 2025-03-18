import { LaceElement } from '../LaceElement.js';

class LabelElement extends LaceElement {
    constructor(text, options = {}) {
        const { bold = false, italic = false } = options;
        const span = document.createElement('span');
        span.style.fontWeight = bold ? "bold" : "normal";
        span.style.fontStyle = italic ? "italic" : "normal";
        span.innerText = text + "\n";
        super("laceLabel", span);
    }
    getObj() { return null; }
    getKeys() { return []; }
    update() { }
    setSize(size) { }
}

export { LabelElement };
