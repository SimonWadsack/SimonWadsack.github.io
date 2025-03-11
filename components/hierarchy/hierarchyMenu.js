class HierarchyMenu {
    creationManager;
    selectionChanged;
    constructor(div, creationManager, selectionChanged, removeSelected) {
        this.creationManager = creationManager;
        this.selectionChanged = selectionChanged;
        const hierarchyMenu = document.createElement('div');
        const buttons = document.createElement('sl-button-group');
        buttons.style.width = '100%';
        const dropdown = document.createElement('sl-dropdown');
        dropdown.style.width = '100%';
        dropdown.hoist = true;
        dropdown.placement = 'bottom';
        buttons.appendChild(dropdown);
        const remove = document.createElement('sl-button');
        remove.size = 'small';
        remove.variant = 'danger';
        remove.addEventListener('mousedown', removeSelected);
        const removeIcon = document.createElement('sl-icon');
        removeIcon.style.fontSize = '1.3em';
        removeIcon.name = "x-lg";
        removeIcon.slot = 'prefix';
        const removeText = document.createElement('span');
        removeText.textContent = "Remove";
        remove.appendChild(removeIcon);
        remove.appendChild(removeText);
        buttons.appendChild(remove);
        hierarchyMenu.appendChild(buttons);
        const button = document.createElement('sl-button');
        button.slot = 'trigger';
        button.caret = true;
        button.size = 'small';
        button.style.width = '100%';
        button.variant = 'neutral';
        const icon = document.createElement('sl-icon');
        icon.style.fontSize = '1.3em';
        icon.name = "plus-lg";
        icon.slot = 'prefix';
        const text = document.createElement('span');
        text.textContent = "Add";
        button.appendChild(icon);
        button.appendChild(text);
        dropdown.appendChild(button);
        const menu = document.createElement('sl-menu');
        dropdown.appendChild(menu);
        const curvesLabel = document.createElement('sl-menu-label');
        curvesLabel.textContent = "Curves";
        menu.appendChild(curvesLabel);
        const bezierItem = document.createElement('sl-menu-item');
        bezierItem.classList.add('menu-item');
        bezierItem.addEventListener('click', () => this.addBezierCurve());
        const bezierIcon = document.createElement('sl-icon');
        bezierIcon.name = "bezier";
        bezierIcon.slot = 'prefix';
        const bezierText = document.createElement('span');
        bezierText.textContent = "Bezier Curve";
        bezierItem.appendChild(bezierIcon);
        bezierItem.appendChild(bezierText);
        menu.appendChild(bezierItem);
        const surfacesLabel = document.createElement('sl-menu-label');
        surfacesLabel.textContent = "Surfaces";
        menu.appendChild(surfacesLabel);
        div.appendChild(hierarchyMenu);
    }
    addBezierCurve() {
        const bezierCurve = this.creationManager.createBasicBezierCurve();
        this.selectionChanged(bezierCurve.getUUID());
    }
}

export { HierarchyMenu };
