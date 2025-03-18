import { Raycaster, Vector3, Plane, Color } from 'three';
import { SliderElement } from '../../lacery/elements/sliderElement.js';
import { TextElement } from '../../lacery/elements/textElement.js';
import { ColorElement } from '../../lacery/elements/colorElement.js';
import { Vec3Element } from '../../lacery/elements/vec3Element.js';
import { ListElement, LaceListElement } from '../../lacery/elements/listElement.js';
import { BezierCurveObject } from '../../objects/bezierCurveObject.js';
import { EventBus } from '../../core/events.js';
import { App } from '../../core/app.js';
import { LabelElement } from '../../lacery/elements/labelElement.js';

class BezierCurveInspectorParams {
    name;
    position;
    color;
    controlPoints;
    deCasteljauT;
    constructor() {
        this.name = "";
        this.position = new Vector3(0, 0, 0);
        this.color = new Color(0x000000);
        this.controlPoints = [];
        this.deCasteljauT = 0;
    }
}
class BezierCurveInspector {
    lace;
    tab;
    params;
    currentObject;
    raycaster = new Raycaster();
    constructor(lace) {
        this.lace = lace;
        this.params = new BezierCurveInspectorParams();
        this.currentObject = null;
        this.tab = this.lace.addTab({ vertical: true, onTabChange: () => EventBus.notify('inspectorTabChanged', "inspector" /* EEnv.INSPECTOR */) });
        const objectTab = this.tab.addTab('Object', 'box');
        objectTab.add(new TextElement("", this.params, 'name'));
        objectTab.add(new Vec3Element("Position", this.params.position, 'x', 'y', 'z'));
        objectTab.add(new ColorElement("Color", this.params, 'color'));
        const controlPointsTab = this.tab.addTab('Control Points', 'waypoints');
        controlPointsTab.add(new ListElement("Control Points", this.params.controlPoints, this.listChanged.bind(this), this.listAdd.bind(this), this.listRemove.bind(this), { scrollFix: true }));
        const deCasteljauTab = this.tab.addTab('DeCasteljau', 'spline');
        deCasteljauTab.add(new LabelElement("De-Casteljau Visualization"));
        const slider = new SliderElement("T", this.params, 'deCasteljauT', { min: 0, max: 1, step: 0.01 });
        deCasteljauTab.add(slider);
        deCasteljauTab.registerOnSelected(() => {
            if (!this.currentObject)
                return;
            this.currentObject.enableDeCasteljau();
            App.getSelectionManager().disableEditing();
        });
        deCasteljauTab.registerOnDeSelected(() => {
            if (!this.currentObject)
                return;
            this.currentObject.disableDeCasteljau();
            App.getSelectionManager().enableEditing();
        });
        this.tab.onChange(() => this.inspectorChanged());
        this.lace.hide(this.tab);
        window.addEventListener('keyup', (event) => {
            if (!this.currentObject)
                return;
            if (this.currentObject.getDeCasteljauActive())
                return;
            if (!App.getSelectionManager().isActive())
                return;
            if (event.key === 'Delete' || event.key === 'r') {
                this.listRemove();
            }
            else if (event.key === 'Insert' || event.key === 'e') {
                this.raycaster.setFromCamera(App.getSelectionManager().getMouse(), App.getCamera());
                const forward = new Vector3();
                App.getCamera().getWorldDirection(forward);
                const lastControlPoint = this.params.controlPoints[this.params.controlPoints.length - 1].getPosition();
                const plane = new Plane().setFromNormalAndCoplanarPoint(forward, lastControlPoint);
                const intersection = new Vector3();
                this.raycaster.ray.intersectPlane(plane, intersection);
                intersection.x = Math.round(intersection.x * 100) / 100;
                intersection.y = Math.round(intersection.y * 100) / 100;
                intersection.z = Math.round(intersection.z * 100) / 100;
                this.addControlPoint(intersection.sub(this.params.position));
            }
        });
        window.addEventListener('mousemove', (event) => {
            if (!this.currentObject)
                return;
            if (!App.getSelectionManager().isActive())
                return;
            if (App.isOrbiting())
                return;
            if (!this.currentObject.getDeCasteljauActive())
                return;
            this.raycaster.setFromCamera(App.getSelectionManager().getMouse(), App.getCamera());
            var intersection = this.raycaster.intersectObject(this.currentObject.getCollisionMesh(), false);
            if (intersection.length > 0) {
                this.currentObject.updateDeCasteljauFromNearestPoint(intersection[0].point);
                this.params.deCasteljauT = this.currentObject.getDeCasteljauT();
                slider.update();
                return;
            }
        });
        EventBus.subscribe('objectAdded', "general" /* EEnv.GENERAL */, () => { this.tab.show('Object'); });
        EventBus.subscribe('objectSelected', "viewport" /* EEnv.VIEWPORT */, (object) => {
            if (object instanceof BezierCurveObject) {
                if (object.getDeCasteljauActive()) {
                    this.tab.show('DeCasteljau');
                    App.getSelectionManager().disableEditing();
                }
                else if (this.tab.getActiveTab() === 'DeCasteljau') {
                    this.tab.show('Object');
                    App.getSelectionManager().enableEditing();
                }
            }
        });
    }
    select(object) {
        this.lace.hideAll();
        this.currentObject = object;
        this.objectChanged();
        this.lace.show(this.tab);
    }
    deselect() {
        this.lace.hide(this.tab);
        this.currentObject = null;
    }
    objectChanged() {
        if (!this.currentObject)
            return;
        const position = this.currentObject.getPosition();
        const color = this.currentObject.getColor();
        const controlPoints = this.currentObject.getControlPoints();
        const deCasteljauT = this.currentObject.getDeCasteljauT();
        if (!position || !color || !controlPoints) {
            console.error("BezierCurveInspector:update failed");
            return;
        }
        this.params.name = this.currentObject.getName();
        this.params.position.set(position.x, position.y, position.z);
        this.params.color.set(color);
        //important to not slice the array, because we want to keep the references
        if (controlPoints.length < this.params.controlPoints.length) {
            this.params.controlPoints.length = controlPoints.length;
        }
        //again, keep the references
        controlPoints.forEach((controlPoint, index) => {
            if (this.params.controlPoints[index]) {
                this.params.controlPoints[index].setPosition(controlPoint);
            }
            else {
                this.params.controlPoints.push(new BezierCurveControlPointLaceListElement(controlPoint));
            }
        });
        this.params.deCasteljauT = deCasteljauT;
        this.tab.update();
    }
    inspectorChanged() {
        if (!this.currentObject)
            return;
        this.currentObject.setName(this.params.name);
        this.currentObject.setPosition(this.params.position);
        this.currentObject.updateColor(this.params.color);
        this.currentObject.updateDeCasteljauT(this.params.deCasteljauT);
        EventBus.notify('objectChanged', "inspector" /* EEnv.INSPECTOR */);
    }
    listChanged(index) {
        if (!this.currentObject)
            return;
        const controlPoint = this.params.controlPoints[index].getPosition();
        this.currentObject.updateControlPoint(index, controlPoint);
    }
    listAdd() {
        if (!this.currentObject)
            return;
        const preLast = this.params.controlPoints[this.params.controlPoints.length - 2].getPosition();
        const last = this.params.controlPoints[this.params.controlPoints.length - 1].getPosition();
        const newPosition = this.getNewPosition(last, preLast);
        this.addControlPoint(newPosition);
    }
    addControlPoint(position) {
        if (!this.currentObject)
            return;
        this.currentObject.addControlPoint(position);
        this.objectChanged();
    }
    listRemove() {
        if (!this.currentObject)
            return;
        App.getTransformControls().detach();
        this.currentObject.removeControlPoint(this.params.controlPoints.length - 1);
        this.objectChanged();
    }
    getNewPosition(a, b) {
        var result = new Vector3();
        result.set(a.x + (a.x - b.x), a.y - (a.y - b.y), a.z + (a.z - b.z));
        return result;
    }
}
class BezierCurveControlPointLaceListElement extends LaceListElement {
    position = new Vector3(0, 0, 0);
    constructor(position) {
        super();
        this.position.set(position.x, position.y, position.z);
    }
    setPosition(position) {
        this.position.set(position.x, position.y, position.z);
    }
    getPosition() {
        const result = new Vector3();
        result.set(this.position.x, this.position.y, this.position.z);
        return result;
    }
    getEditor() {
        const positionElement = new Vec3Element("Position", this.position, 'x', 'y', 'z');
        return [positionElement];
    }
}

export { BezierCurveInspector };
