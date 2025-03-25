import * as THREE from 'three';
import { VisualObject } from './visualObject.js';
import { getSelectedColor, getHighlightColor } from '../core/vars.js';
import { UniformBSplineCurve } from '../utils/curves/uniformBSplineCurve.js';
import { App } from '../core/app.js';

var UniformBSplineObjectMode;
(function (UniformBSplineObjectMode) {
    UniformBSplineObjectMode[UniformBSplineObjectMode["OBJECT"] = 0] = "OBJECT";
    UniformBSplineObjectMode[UniformBSplineObjectMode["CONTROL_POINTS"] = 1] = "CONTROL_POINTS";
})(UniformBSplineObjectMode || (UniformBSplineObjectMode = {}));
class UniformBSplineObject extends VisualObject {
    mode;
    controlPoints;
    degree;
    segments;
    radius;
    radialSegments;
    geometry;
    material;
    curve;
    connectionVisual;
    constructor(name, controlPoints = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(0, 5, 0), new THREE.Vector3(5, 0, 0)], degree = 2, color = new THREE.Color(0x000000), segments = 100, position = new THREE.Vector3(0, 0, 0), mode = UniformBSplineObjectMode.CONTROL_POINTS) {
        const curve = new UniformBSplineCurve(controlPoints, degree);
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
        this.degree = degree;
        this.color = color;
        this.segments = segments;
        this.mode = mode;
        this.radius = radius;
        this.radialSegments = radialSegments;
        this.type = 'UniformBSplineObject';
        //Setup control point mode
        for (let i = 0; i < this.controlPoints.length; i++) {
            this.createEditHandle(i);
            this.setEditHandlePosition(i, this.controlPoints[i]);
        }
        const visualGeometry = new THREE.BufferGeometry().setFromPoints(this.controlPoints);
        const visualMaterial = new THREE.LineBasicMaterial({ color: getSelectedColor() });
        this.connectionVisual = new THREE.Line(visualGeometry, visualMaterial);
        this.connectionVisual.castShadow = true;
        mesh.add(this.connectionVisual);
        this.connectionVisual.visible = false;
        this.hideEditHandles();
    }
    //#region Modes
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
        if (mode === UniformBSplineObjectMode.OBJECT) {
            this.connectionVisual.visible = false;
            this.hideEditHandles();
        }
        else if (mode === UniformBSplineObjectMode.CONTROL_POINTS) {
            this.connectionVisual.visible = true;
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
            degree: this.degree,
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
        if (UniformBSplineObjectMode[mode] === undefined)
            throw new Error("Invalid UniformBSplineObject mode");
        return new UniformBSplineObject(json.name, controlPoints, json.degree, color, json.segments, position, mode);
    }
    //#endregion
    //#region Editing
    edit() {
        return this.editUpdate.bind(this);
    }
    editUpdate() {
        if (this.mode === UniformBSplineObjectMode.CONTROL_POINTS) {
            const index = App.getSelectionManager().getSelectedEditHandleIndex();
            if (index === null)
                return;
            const handlePosition = this.getEditHandlePosition(index);
            if (handlePosition === null)
                return;
            this.updateControlPoint(index, handlePosition);
            this.updateConnectionVisual();
        }
    }
    unedit() {
        this.connectionVisual.visible = false;
        this.hideEditHandles();
    }
    //#endregion
    //#region Control Points
    addControlPoint(point, front = false) {
        if (front)
            this.controlPoints.unshift(point);
        else
            this.controlPoints.push(point);
        this.recompute();
        this.updateConnectionVisual();
        if (front) {
            this.createEditHandle(this.controlPoints.length - 1);
            for (let i = 0; i < this.controlPoints.length; i++) {
                this.setEditHandlePosition(i, this.controlPoints[i]);
            }
        }
        else {
            this.createEditHandle(this.controlPoints.length - 1);
            this.setEditHandlePosition(this.controlPoints.length - 1, point);
        }
        if (this.controlPoints.length > 100)
            this.updateSegments(1000);
        else if (this.controlPoints.length > 30)
            this.updateSegments(500);
    }
    removeControlPoint(atFront = false) {
        if (this.controlPoints.length <= 3)
            return;
        if (atFront)
            this.controlPoints.shift();
        else
            this.controlPoints.pop();
        this.recompute();
        this.updateConnectionVisual();
        if (atFront) {
            this.removeEditHandle(this.controlPoints.length);
            for (let i = 0; i < this.controlPoints.length; i++) {
                this.setEditHandlePosition(i, this.controlPoints[i]);
            }
        }
        else {
            this.removeEditHandle(this.controlPoints.length);
        }
        if (this.controlPoints.length < 30)
            this.updateSegments(100);
        else if (this.controlPoints.length < 100)
            this.updateSegments(500);
    }
    updateControlPoint(index, point) {
        this.controlPoints[index].set(point.x, point.y, point.z);
        this.recompute();
        this.updateConnectionVisual();
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
    //#region Degree
    getDegree() {
        return this.degree;
    }
    setDegree(degree) {
        this.degree = degree;
        this.curve.setDegree(degree);
        this.recompute();
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
    updateConnectionVisual() {
        if (this.connectionVisual === null)
            return;
        this.connectionVisual.geometry.dispose();
        this.connectionVisual.geometry = new THREE.BufferGeometry().setFromPoints(this.controlPoints);
    }
    recompute() {
        this.curve.setPoints(this.controlPoints);
        if (this.geometry)
            this.geometry.dispose();
        this.geometry = new THREE.TubeGeometry(this.curve, this.segments, this.radius, this.radialSegments, false);
        this.mesh.geometry = this.geometry;
    }
}

export { UniformBSplineObject };
