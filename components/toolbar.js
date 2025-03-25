import { App } from '../core/app.js';

class Toolbar {
    closed = false;
    constructor(container) {
        const div = document.createElement('div');
        div.className = 'toolbar';
        const toolbarDiv = document.createElement('div');
        toolbarDiv.style.display = App.getIOManager().getFlagCache('toolbarClosed') ? 'none' : 'flex';
        toolbarDiv.style.flexDirection = 'row';
        toolbarDiv.style.flexWrap = 'wrap';
        div.appendChild(toolbarDiv);
        const buttonGroup = document.createElement('sl-button-group');
        buttonGroup.label = 'Scene Management';
        toolbarDiv.appendChild(buttonGroup);
        const dropdown = document.createElement('sl-dropdown');
        buttonGroup.appendChild(dropdown);
        const button = document.createElement('sl-button');
        button.textContent = 'File';
        button.slot = 'trigger';
        button.size = 'medium';
        button.caret = true;
        dropdown.appendChild(button);
        const menu = document.createElement('sl-menu');
        dropdown.appendChild(menu);
        const saveItem = document.createElement('sl-menu-item');
        const icon = document.createElement('sl-icon');
        icon.library = 'lucide';
        icon.name = 'save';
        icon.slot = 'prefix';
        saveItem.appendChild(icon);
        const text = document.createTextNode('Save');
        saveItem.appendChild(text);
        saveItem.value = 'save';
        menu.appendChild(saveItem);
        const loadItem = document.createElement('sl-menu-item');
        const icon2 = document.createElement('sl-icon');
        icon2.library = 'lucide';
        icon2.name = 'file-up';
        icon2.slot = 'prefix';
        loadItem.appendChild(icon2);
        const text2 = document.createTextNode('Load');
        loadItem.appendChild(text2);
        loadItem.value = 'load';
        menu.appendChild(loadItem);
        menu.addEventListener('sl-select', (event) => {
            switch (event.detail.item.value) {
                case 'save':
                    this.save();
                    break;
                case 'load':
                    this.load();
                    break;
                default:
                    console.warn('Unknown menu item selected!');
                    break;
            }
        });
        const resetButton = document.createElement('sl-button');
        const resetIcon = document.createElement('sl-icon');
        resetIcon.library = 'lucide';
        resetIcon.name = 'list-restart';
        resetIcon.slot = 'prefix';
        resetButton.appendChild(resetIcon);
        const text3 = document.createTextNode('Reset Scene');
        resetButton.appendChild(text3);
        resetButton.size = 'medium';
        resetButton.onclick = () => this.resetScene();
        buttonGroup.appendChild(resetButton);
        const dimensionButton = document.createElement('sl-button');
        dimensionButton.textContent = App.dimension2D() ? '3D' : '2D';
        dimensionButton.size = 'medium';
        dimensionButton.style.marginLeft = '0.5rem';
        dimensionButton.onclick = () => {
            App.switchDimension();
            dimensionButton.textContent = App.dimension2D() ? '3D' : '2D';
        };
        toolbarDiv.appendChild(dimensionButton);
        const closeButton = document.createElement('sl-button');
        const closeIcon = document.createElement('sl-icon');
        closeIcon.library = 'lucide';
        closeIcon.name = 'chevron-left';
        closeIcon.slot = 'prefix';
        closeButton.appendChild(closeIcon);
        closeButton.size = 'medium';
        closeButton.style.marginLeft = '0.5rem';
        closeButton.onclick = () => {
            this.closed = true;
            toolbarDiv.style.display = 'none';
            openButton.style.display = 'flex';
            App.getIOManager().setFlagCache('toolbarClosed', true);
        };
        toolbarDiv.appendChild(closeButton);
        const openButton = document.createElement('sl-button');
        const openIcon = document.createElement('sl-icon');
        openIcon.library = 'lucide';
        openIcon.name = 'chevron-right';
        openIcon.slot = 'prefix';
        openButton.appendChild(openIcon);
        openButton.size = 'medium';
        openButton.style.display = App.getIOManager().getFlagCache('toolbarClosed') ? '' : 'none';
        openButton.onclick = () => {
            this.closed = false;
            toolbarDiv.style.display = 'flex';
            openButton.style.display = 'none';
            App.getIOManager().setFlagCache('toolbarClosed', false);
        };
        div.appendChild(openButton);
        container.appendChild(div);
    }
    save() {
        const now = new Date();
        const formattedDate = now.toISOString().split('.')[0].replaceAll('-', '_').replace('T', '-').replaceAll(':', '_');
        App.getIOManager().saveSceneToFile('SplineVis_' + formattedDate + '.json');
    }
    load() {
        App.getIOManager().loadSceneFromFile();
    }
    resetScene() {
        App.getInteractionsManager().confirm('Reset Scene', 'Are you sure you want to reset the scene?', (value) => {
            if (value) {
                App.getTransformControls().detach();
                App.getObjectManager().removeObjects();
                App.getIOManager().clearSceneCache();
            }
        });
    }
}

export { Toolbar };
