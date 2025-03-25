import * as THREE from 'three';
import { VisualObject } from './visualObject.js';
import { getHighlightColor, getSelectedColor } from '../core/vars.js';
import { LineGeometry, LineMaterial, Line2 } from 'three/examples/jsm/Addons.js';
import { App } from '../core/app.js';

var LinearCurveObjectMode;
(function (LinearCurveObjectMode) {
    LinearCurveObjectMode[LinearCurveObjectMode["OBJECT"] = 0] = "OBJECT";
    LinearCurveObjectMode[LinearCurveObjectMode["CONTROL_POINTS"] = 1] = "CONTROL_POINTS";
})(LinearCurveObjectMode || (LinearCurveObjectMode = {}));
class LinearCurveObject extends VisualObject {
    mode;
    controlPoints;
    geometry;
    material;
    constructor(name, controlPoints = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(0, 5, 0), new THREE.Vector3(5, 0, 0)], color = new THREE.Color(0x000000), position = new THREE.Vector3(0, 0, 0), mode = LinearCurveObjectMode.CONTROL_POINTS) {
        const geometry = new LineGeometry().setPositions(controlPoints.map((point) => [point.x, point.y, point.z]).flat());
        const material = new LineMaterial({ color: color, linewidth: 5 });
        material.side = THREE.DoubleSide;
        const mesh = new Line2(geometry, material);
        super(name, mesh, position);
        this.geometry = geometry;
        this.material = material;
        this.controlPoints = controlPoints;
        this.color = color;
        this.mode = mode;
        this.type = 'LinearCurveObject';
        //setup control point mode
        for (let i = 0; i < this.controlPoints.length; i++) {
            this.createEditHandle(i);
            this.setEditHandlePosition(i, this.controlPoints[i]);
        }
        this.hideEditHandles();
    }
    //#region Modes
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
        if (mode === LinearCurveObjectMode.OBJECT) {
            this.hideEditHandles();
        }
        else if (mode === LinearCurveObjectMode.CONTROL_POINTS) {
            this.showEditHandles();
        }
    }
    //#endregion
    //#region JSON
    toJSON() {
        return {
            name: this.name,
            type: this.type,
            position: { x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z },
            controlPoints: this.controlPoints.map((point) => ({ x: point.x, y: point.y, z: point.z })),
            color: this.color.getHex(),
            mode: this.mode
        };
    }
    static fromJSON(json) {
        const controlPoints = json.controlPoints.map((point) => new THREE.Vector3(point.x, point.y, point.z));
        const color = new THREE.Color(json.color);
        const position = new THREE.Vector3(json.position.x, json.position.y, json.position.z);
        const mode = json.mode;
        if (LinearCurveObjectMode[mode] === undefined)
            throw new Error(`Invalid LinearCurveObjectMode: ${mode}`);
        return new LinearCurveObject(json.name, controlPoints, color, position, mode);
    }
    //#endregion
    //#region Editing
    edit() {
        return this.editUpdate.bind(this);
    }
    editUpdate() {
        if (this.mode === LinearCurveObjectMode.CONTROL_POINTS) {
            const index = App.getSelectionManager().getSelectedEditHandleIndex();
            if (index === null)
                return;
            const handlePosition = this.getEditHandlePosition(index);
            if (handlePosition === null)
                return;
            this.updateControlPoint(index, handlePosition);
        }
    }
    unedit() {
        this.hideEditHandles();
    }
    //#endregion
    //#region Updates
    updateColor(color) {
        super.setColor(color);
        this.material.color.set(color);
    }
    //#endregion
    //#region Control Points
    addControlPoint(point, atFront = false) {
        if (atFront)
            this.controlPoints.unshift(point);
        else
            this.controlPoints.push(point);
        this.recompute();
        if (atFront) {
            this.createEditHandle(this.controlPoints.length - 1);
            for (let i = 0; i < this.controlPoints.length; i++) {
                this.setEditHandlePosition(i, this.controlPoints[i]);
            }
        }
        else {
            this.createEditHandle(this.controlPoints.length - 1);
            this.setEditHandlePosition(this.controlPoints.length - 1, point);
        }
    }
    removeControlPoint(atFront = false) {
        if (this.controlPoints.length <= 2)
            return;
        if (atFront)
            this.controlPoints.shift();
        else
            this.controlPoints.pop();
        this.recompute();
        if (atFront) {
            this.removeEditHandle(this.controlPoints.length);
            for (let i = 0; i < this.controlPoints.length; i++) {
                this.setEditHandlePosition(i, this.controlPoints[i]);
            }
        }
        else {
            this.removeEditHandle(this.controlPoints.length);
        }
    }
    updateControlPoint(index, point) {
        this.controlPoints[index].set(point.x, point.y, point.z);
        this.recompute();
        if (this.hasEditHandle(index)) {
            this.setEditHandlePosition(index, point);
        }
    }
    getControlPoint(index) {
        return this.controlPoints[index];
    }
    getControlPoints() {
        return this.controlPoints.slice();
    }
    //#endregion
    //#region Highlight and Select (Override)
    highlight() {
        this.material.color.set(getHighlightColor());
    }
    resetHighlight() {
        this.resetColor();
    }
    select() {
        this.material.color.set(getSelectedColor());
    }
    resetSelect() {
        this.resetColor();
    }
    resetColor() {
        this.material.color.set(this.color);
    }
    //#endregion
    //#region Private Methods
    recompute() {
        if (this.geometry)
            this.geometry.dispose();
        this.geometry = new LineGeometry().setPositions(this.controlPoints.map((point) => [point.x, point.y, point.z]).flat());
        this.mesh.geometry = this.geometry;
    }
}

export { LinearCurveObject };
