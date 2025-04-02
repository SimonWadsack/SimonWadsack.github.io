import { LaceElement } from '../LaceElement.js';

class LabelElement extends LaceElement {
    constructor(text, options = {}) {
        const { block = false, newLine = true, bold = false, italic = false } = options;
        const span = document.createElement('span');
        span.style.fontSize = "var(--sl-input-label-font-size-small)";
        span.style.fontWeight = bold ? "bold" : "normal";
        span.style.fontStyle = italic ? "italic" : "normal";
        span.innerHTML = text;
        span.innerHTML = block ? "<p style='text-align: justify'>" + span.innerHTML + "</p>" : span.innerHTML;
        span.innerHTML += newLine ? "<br>" : "";
        super("laceLabel", span);
    }
    getObj() { return null; }
    getKeys() { return []; }
    update() { }
    setSize(size) { }
}

export { LabelElement };
