import * as THREE from 'three';
import { VisualObject } from './visualObject.js';
import { getSelectedColor, getHighlightColor } from '../core/vars.js';
import { BezierSplineCurve } from '../utils/curves/bezierSplineCurve.js';
import { App } from '../core/app.js';

var BezierSplineObjectMode;
(function (BezierSplineObjectMode) {
    BezierSplineObjectMode[BezierSplineObjectMode["OBJECT"] = 0] = "OBJECT";
    BezierSplineObjectMode[BezierSplineObjectMode["CONTROL_POINTS"] = 1] = "CONTROL_POINTS";
})(BezierSplineObjectMode || (BezierSplineObjectMode = {}));
class BezierSplineObject extends VisualObject {
    mode;
    controlPoints;
    segments;
    radius;
    radialSegments;
    geometry;
    material;
    curve;
    connectionVisuals;
    constructor(name, controlPoints = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(0, 5, 0), new THREE.Vector3(5, 0, 0)], color = new THREE.Color(0x000000), segments = 100, position = new THREE.Vector3(0, 0, 0), mode = BezierSplineObjectMode.CONTROL_POINTS) {
        const curve = new BezierSplineCurve(controlPoints);
        const radius = 0.05;
        const radialSegments = 8;
        const geometry = new THREE.TubeGeometry(curve, segments, radius, radialSegments, false);
        const material = new THREE.MeshBasicMaterial({ color: color });
        material.side = THREE.DoubleSide;
        const mesh = new THREE.Mesh(geometry, material);
        super(name, mesh, position);
        this.curve = curve;
        this.geometry = geometry;
        this.material = material;
        this.controlPoints = controlPoints;
        this.color = color;
        this.segments = segments;
        this.mode = mode;
        this.radius = radius;
        this.radialSegments = radialSegments;
        this.type = 'BezierSplineObject';
        //Setup control point mode
        for (let i = 0; i < this.controlPoints.length; i++) {
            if (i % 3 === 0)
                this.createEditHandle(i, 0.3);
            else
                this.createEditHandle(i, 0.15);
            this.setEditHandlePosition(i, this.controlPoints[i]);
        }
        this.connectionVisuals = [];
        const connectionMaterial = new THREE.LineBasicMaterial({ color: getSelectedColor() });
        this.connectionVisuals.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints([this.controlPoints[0], this.controlPoints[1]]), connectionMaterial));
        const cvAmount = Math.floor((this.controlPoints.length - 1) / 3) + 1;
        for (let i = 1; i < cvAmount - 1; i++) {
            const index = 2 + (i - 1) * 3;
            const points = [this.controlPoints[index], this.controlPoints[index + 1], this.controlPoints[index + 2]];
            this.connectionVisuals.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), connectionMaterial));
        }
        this.connectionVisuals.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints([this.controlPoints[this.controlPoints.length - 2], this.controlPoints[this.controlPoints.length - 1]]), connectionMaterial));
        this.connectionVisuals.forEach((visual) => this.mesh.add(visual));
        this.hideConnectionVisuals();
        this.hideEditHandles();
    }
    //#region Modes
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
        if (mode === BezierSplineObjectMode.OBJECT) {
            this.hideConnectionVisuals();
            this.hideEditHandles();
        }
        else if (mode === BezierSplineObjectMode.CONTROL_POINTS) {
            this.showConnectionVisuals();
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
            segments: this.segments,
            mode: this.mode
        };
    }
    static fromJSON(json) {
        const controlPoints = json.controlPoints.map((point) => new THREE.Vector3(point.x, point.y, point.z));
        const color = new THREE.Color(json.color);
        const position = new THREE.Vector3(json.position.x, json.position.y, json.position.z);
        const mode = json.mode;
        if (BezierSplineObjectMode[mode] === undefined)
            throw new Error("Invalid BezierCurveObject mode");
        return new BezierSplineObject(json.name, controlPoints, color, json.segments, position, mode);
    }
    //#endregion
    //#region Editing
    edit() {
        return this.editUpdate.bind(this);
    }
    editUpdate() {
        if (this.mode === BezierSplineObjectMode.CONTROL_POINTS) {
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
        this.hideConnectionVisuals();
        this.hideEditHandles();
    }
    //#endregion
    //#region Updates
    updateSegments(segments) {
        this.segments = segments;
        this.recompute();
    }
    updateColor(color) {
        super.setColor(color);
        this.material.color.set(color);
    }
    dispose() {
        this.material.dispose();
    }
    //#endregion
    //#region Control Points
    addControlPoint(point, front = false) {
        if (front) {
            const n = this.controlPoints.length - 1;
            this.controlPoints.unshift(new THREE.Vector3(0, 0, 0));
            this.createEditHandle(n + 1, 0.15);
            const newHandle = point.clone().add(this.controlPoints[1].clone().sub(point).setLength(3));
            this.controlPoints.unshift(newHandle);
            this.createEditHandle(n + 2, 0.15);
            this.controlPoints.unshift(point.clone());
            this.createEditHandle(n + 3, 0.3);
            for (let i = 0; i < this.controlPoints.length; i++) {
                this.setEditHandlePosition(i, this.controlPoints[i]);
            }
            this.updateControlPoint(4, this.controlPoints[4]);
            this.updateControlPoint(0, this.controlPoints[0]);
            const firstVisual = new THREE.Line(new THREE.BufferGeometry().setFromPoints([this.controlPoints[0], this.controlPoints[1]]), new THREE.LineBasicMaterial({ color: getSelectedColor() }));
            this.connectionVisuals.unshift(firstVisual);
            this.mesh.add(firstVisual);
        }
        else {
            const n = this.controlPoints.length - 1;
            this.controlPoints.push(new THREE.Vector3(0, 0, 0));
            this.createEditHandle(n + 1, 0.15);
            const newHandle = point.clone().add(this.controlPoints[n].clone().sub(point).setLength(3));
            this.controlPoints.push(newHandle);
            this.createEditHandle(n + 2, 0.15);
            this.controlPoints.push(point.clone());
            this.createEditHandle(n + 3, 0.3);
            this.updateControlPoint(n - 1, this.controlPoints[n - 1]);
            this.updateControlPoint(n + 3, this.controlPoints[n + 3]);
            const lastVisual = new THREE.Line(new THREE.BufferGeometry().setFromPoints([this.controlPoints[this.controlPoints.length - 2], this.controlPoints[this.controlPoints.length - 1]]), new THREE.LineBasicMaterial({ color: getSelectedColor() }));
            this.connectionVisuals.push(lastVisual);
            this.mesh.add(lastVisual);
        }
        this.recompute();
        this.updateConnectionVisuals();
        if (this.controlPoints.length > 100)
            this.updateSegments(1000);
        else if (this.controlPoints.length > 40)
            this.updateSegments(500);
    }
    removeControlPoint(atFront = false) {
        if (this.controlPoints.length <= 6)
            return;
        if (atFront) {
            this.controlPoints.shift();
            this.removeEditHandle(this.controlPoints.length);
            this.controlPoints.shift();
            this.removeEditHandle(this.controlPoints.length);
            this.controlPoints.shift();
            this.removeEditHandle(this.controlPoints.length);
            for (let i = 0; i < this.controlPoints.length; i++) {
                this.setEditHandlePosition(i, this.controlPoints[i]);
            }
            const firstVisual = this.connectionVisuals.shift();
            if (firstVisual)
                this.mesh.remove(firstVisual);
        }
        else {
            this.controlPoints.pop();
            this.removeEditHandle(this.controlPoints.length);
            this.controlPoints.pop();
            this.removeEditHandle(this.controlPoints.length);
            this.controlPoints.pop();
            this.removeEditHandle(this.controlPoints.length);
            const lastVisual = this.connectionVisuals.pop();
            if (lastVisual)
                this.mesh.remove(lastVisual);
        }
        this.recompute();
        this.updateConnectionVisuals();
        if (this.controlPoints.length < 40)
            this.updateSegments(100);
        else if (this.controlPoints.length < 100)
            this.updateSegments(500);
    }
    updateControlPoint(index, point) {
        if (index === 0) { //special first case
            const delta = point.clone().sub(this.controlPoints[0]);
            this.controlPoints[0].set(point.x, point.y, point.z);
            this.setEditHandle(0);
            this.controlPoints[1].add(delta);
            this.setEditHandle(1);
        }
        else if (index === 1) { //special case for first handle
            this.controlPoints[1].set(point.x, point.y, point.z);
            this.setEditHandle(1);
        }
        else if (index === this.controlPoints.length - 1) { //special last case
            const delta = point.clone().sub(this.controlPoints[this.controlPoints.length - 1]);
            this.controlPoints[this.controlPoints.length - 1].set(point.x, point.y, point.z);
            this.setEditHandle(this.controlPoints.length - 1);
            this.controlPoints[this.controlPoints.length - 2].add(delta);
            this.setEditHandle(this.controlPoints.length - 2);
        }
        else if (index === this.controlPoints.length - 2) { //special case for last handle
            this.controlPoints[this.controlPoints.length - 2].set(point.x, point.y, point.z);
            this.setEditHandle(this.controlPoints.length - 2);
        }
        else if (index % 3 === 0) { //anchor
            const delta = point.clone().sub(this.controlPoints[index]);
            this.controlPoints[index].set(point.x, point.y, point.z);
            this.setEditHandle(index);
            this.controlPoints[index - 1].add(delta);
            this.setEditHandle(index - 1);
            this.controlPoints[index + 1].add(delta);
            this.setEditHandle(index + 1);
        }
        else if (index % 3 === 1) { //handle up
            this.controlPoints[index].set(point.x, point.y, point.z);
            this.setEditHandle(index);
            const anchor = this.controlPoints[index - 1];
            const handleDown = anchor.clone().multiplyScalar(2).sub(point);
            this.controlPoints[index - 2].set(handleDown.x, handleDown.y, handleDown.z);
            this.setEditHandle(index - 2);
        }
        else if (index % 3 === 2) { //handle down
            this.controlPoints[index].set(point.x, point.y, point.z);
            this.setEditHandle(index);
            const anchor = this.controlPoints[index + 1];
            const handleUp = anchor.clone().multiplyScalar(2).sub(point);
            this.controlPoints[index + 2].set(handleUp.x, handleUp.y, handleUp.z);
            this.setEditHandle(index + 2);
        }
        this.recompute();
        this.updateConnectionVisuals();
    }
    setEditHandle(index) {
        if (!this.hasEditHandle(index))
            return;
        this.setEditHandlePosition(index, this.controlPoints[index]);
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
    hideConnectionVisuals() {
        if (this.connectionVisuals === null)
            return;
        this.connectionVisuals.forEach((visual) => visual.visible = false);
    }
    showConnectionVisuals() {
        if (this.connectionVisuals === null)
            return;
        this.connectionVisuals.forEach((visual) => visual.visible = true);
    }
    updateConnectionVisuals() {
        if (this.connectionVisuals === null)
            return;
        this.connectionVisuals[0].geometry.dispose();
        this.connectionVisuals[0].geometry = new THREE.BufferGeometry().setFromPoints([this.controlPoints[0], this.controlPoints[1]]);
        const cvAmount = Math.floor((this.controlPoints.length - 1) / 3) + 1;
        for (let i = 1; i < cvAmount - 1; i++) {
            const index = 2 + (i - 1) * 3;
            const points = [this.controlPoints[index], this.controlPoints[index + 1], this.controlPoints[index + 2]];
            this.connectionVisuals[i].geometry.dispose();
            this.connectionVisuals[i].geometry = new THREE.BufferGeometry().setFromPoints(points);
        }
        this.connectionVisuals[this.connectionVisuals.length - 1].geometry.dispose();
        this.connectionVisuals[this.connectionVisuals.length - 1].geometry = new THREE.BufferGeometry().setFromPoints([this.controlPoints[this.controlPoints.length - 2], this.controlPoints[this.controlPoints.length - 1]]);
    }
    recompute() {
        this.curve.setPoints(this.controlPoints);
        if (this.geometry)
            this.geometry.dispose();
        this.geometry = new THREE.TubeGeometry(this.curve, this.segments, this.radius, this.radialSegments, false);
        this.mesh.geometry = this.geometry;
    }
}

export { BezierSplineObject };
