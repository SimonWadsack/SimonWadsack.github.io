import { App } from '../../core/app.js';
import { getIcon } from '../../core/vars.js';

class HierarchyMenu {
    selectionChanged;
    constructor(div, selectionChanged, removeSelected) {
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
        //TODO - manager that holds all objects and their creation functions
        menu.appendChild(this.addNewObject("Linear Curve", 'LinearCurveObject', this.addLinearCurve.bind(this)));
        menu.appendChild(this.addNewObject("Bezier Curve", "BezierCurveObject", this.addBezierCurve.bind(this)));
        menu.appendChild(this.addNewObject("Bezier Spline", "BezierSplineObject", this.addBezierSpline.bind(this)));
        menu.appendChild(this.addNewObject("Uniform B-Spline", "UniformBSplineObject", this.addUniformBSplineCurve.bind(this)));
        menu.appendChild(this.addNewObject("Uniform Rational B-Spline", "UniformRationBSplineObject", this.addURBSCurve.bind(this)));
        const surfacesLabel = document.createElement('sl-menu-label');
        surfacesLabel.textContent = "Surfaces";
        menu.appendChild(surfacesLabel);
        menu.appendChild(this.addNewObject("Bezier Patch", "BezierPatchObject", this.addBezierPatch.bind(this)));
        menu.appendChild(this.addNewObject("Uniform B-Spline Surface", "UniformBSplineSurfaceObject", this.addUniformBSplineSurface.bind(this)));
        menu.appendChild(this.addNewObject("Uniform Rational B-Spline Surface", "UniformRationalBSplineSurfaceObject", this.addUniformRationalBSplineSurface.bind(this)));
        div.appendChild(hierarchyMenu);
    }
    addNewObject(name, type, onclick) {
        const item = document.createElement('sl-menu-item');
        item.classList.add('menu-item');
        item.onclick = onclick;
        const { name: iconName, lucide: lucide } = getIcon(type);
        const icon = document.createElement('sl-icon');
        icon.name = iconName;
        if (lucide)
            icon.library = 'lucide';
        icon.slot = 'prefix';
        const text = document.createElement('span');
        text.textContent = name;
        item.appendChild(icon);
        item.appendChild(text);
        return item;
    }
    addLinearCurve() {
        const linearCurve = App.getCreationManager().createBasicLinearCurve();
        this.selectionChanged(linearCurve.getUUID());
    }
    addBezierCurve() {
        const bezierCurve = App.getCreationManager().createBasicBezierCurve();
        this.selectionChanged(bezierCurve.getUUID());
    }
    addBezierSpline() {
        const bezierSpline = App.getCreationManager().createBasicBezierSpline();
        this.selectionChanged(bezierSpline.getUUID());
    }
    addUniformBSplineCurve() {
        const uniformBSplineCurve = App.getCreationManager().createBasicUniformBSpline();
        this.selectionChanged(uniformBSplineCurve.getUUID());
    }
    addURBSCurve() {
        const urbsCurve = App.getCreationManager().createBasicURBS();
        this.selectionChanged(urbsCurve.getUUID());
    }
    addBezierPatch() {
        const bezierPatch = App.getCreationManager().createBasicBezierPatch();
        this.selectionChanged(bezierPatch.getUUID());
    }
    addUniformBSplineSurface() {
        const uniformBSplineSurface = App.getCreationManager().createBasicUniformBSplineSurface();
        this.selectionChanged(uniformBSplineSurface.getUUID());
    }
    addUniformRationalBSplineSurface() {
        const uniformRationalBSplineSurface = App.getCreationManager().createBasicUniformRationalBSplineSurface();
        this.selectionChanged(uniformRationalBSplineSurface.getUUID());
    }
}

export { HierarchyMenu };
