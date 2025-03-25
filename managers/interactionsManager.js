class InteractionsManager {
    keydowns;
    constructor() {
        this.keydowns = new Map();
        window.addEventListener('keydown', (event) => {
            const key = event.key;
            if (this.keydowns.has(key)) {
                this.keydowns.get(key)?.forEach(callback => callback());
            }
        });
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
        const dialog = document.createElement('sl-dialog');
        dialog.label = header;
        dialog.classList.add('confirm-dialog');
        dialog.addEventListener('sl-request-close', (event) => {
            resolve(false);
        });
        const messageText = document.createElement('div');
        messageText.innerHTML = message;
        dialog.appendChild(messageText);
        const confirmButton = document.createElement('sl-button');
        confirmButton.variant = 'success';
        confirmButton.innerText = 'Confirm';
        confirmButton.slot = 'footer';
        confirmButton.onclick = () => {
            resolve(true);
            dialog.hide();
        };
        dialog.appendChild(confirmButton);
        const cancelButton = document.createElement('sl-button');
        cancelButton.variant = 'danger';
        cancelButton.innerText = 'Cancel';
        cancelButton.slot = 'footer';
        cancelButton.onclick = () => {
            resolve(false);
            dialog.hide();
        };
        dialog.appendChild(cancelButton);
        document.body.appendChild(dialog);
        dialog.show();
    }
}

export { InteractionsManager };
