import { App } from '../core/app.js';

class InteractionsManager {
    keydowns;
    static blockedTags = ['SL-INPUT', 'SL-COLOR-PICKER'];
    dialog;
    constructor() {
        this.keydowns = new Map();
        this.dialog = document.createElement('sl-dialog');
        window.addEventListener('keydown', (event) => {
            const key = event.key;
            const target = event.target;
            if (InteractionsManager.blockedTags.includes(target.tagName)) {
                return;
            }
            if (this.keydowns.has(key)) {
                this.keydowns.get(key)?.forEach(callback => callback());
            }
        });
        this.addKeydown('d', () => { App.switchDimension(); });
    }
    addKeydown(key, callback) {
        if (this.keydowns.has(key)) {
            this.keydowns.get(key)?.push(callback);
        }
        else {
            this.keydowns.set(key, [callback]);
        }
    }
    addKeydowns(keys, callback) {
        keys.forEach(key => this.addKeydown(key, callback));
    }
    toast(header, message, type) {
        const variant = type === 'setting' ? 'neutral' : type === 'info' ? 'primary' : type === 'error' ? 'danger' : type;
        const iconName = type === 'info' ? 'info' :
            type === 'success' ? 'circle-check-big' :
                type === 'setting' ? 'settings' :
                    type === 'warning' ? 'triangle-alert' :
                        type === 'error' ? 'circle-x' : 'message-circle-warning';
        const alert = document.createElement('sl-alert');
        alert.variant = variant;
        alert.closable = false;
        alert.duration = 1000;
        const icon = document.createElement('sl-icon');
        icon.name = iconName;
        icon.library = 'lucide';
        icon.slot = 'icon';
        alert.appendChild(icon);
        const text = document.createElement('span');
        text.innerHTML = '<strong>' + header + '</strong><br />' + message;
        alert.appendChild(text);
        const alertObject = Object.assign(alert);
        document.body.appendChild(alertObject);
        alert.toast();
    }
    confirm(header, message, resolve) {
        this.dialog.innerHTML = '';
        this.dialog.label = header;
        this.dialog.classList.add('confirm-dialog');
        this.dialog.style.color = 'var(--sl-input-color)';
        this.dialog.addEventListener('sl-request-close', (event) => {
            resolve(false);
        });
        const messageText = document.createElement('div');
        messageText.innerHTML = message;
        this.dialog.appendChild(messageText);
        const confirmButton = document.createElement('sl-button');
        confirmButton.variant = 'success';
        confirmButton.innerText = 'Confirm';
        confirmButton.slot = 'footer';
        confirmButton.onclick = () => {
            resolve(true);
            this.dialog.hide();
        };
        this.dialog.appendChild(confirmButton);
        const cancelButton = document.createElement('sl-button');
        cancelButton.variant = 'danger';
        cancelButton.innerText = 'Cancel';
        cancelButton.slot = 'footer';
        cancelButton.onclick = () => {
            resolve(false);
            this.dialog.hide();
        };
        this.dialog.appendChild(cancelButton);
        App.getApp().appendChild(this.dialog);
        this.dialog.show();
    }
}

export { InteractionsManager };
