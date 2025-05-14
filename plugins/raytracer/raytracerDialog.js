import { App } from '../../core/app.js';

class RaytracerDialog {
    dialog;
    constructor() {
        this.dialog = document.createElement('sl-dialog');
        this.dialog.noHeader = true;
        this.dialog.style.color = 'var(--sl-input-color)';
        this.dialog.style.fontFamily = 'var(--sl-font-sans)';
        this.dialog.addEventListener('sl-request-close', (e) => {
            e.preventDefault();
        });
        // TEMP
        this.dialog.innerHTML = `
            <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; height: 100%;">
                <sl-spinner></sl-spinner>
                <h4 style="margin-left: 10px;">Raytracing...</h4>
            </div>
        `;
        App.getApp().appendChild(this.dialog);
    }
    show() {
        this.dialog.show();
    }
    hide() {
        this.dialog.hide();
    }
}

export { RaytracerDialog };
