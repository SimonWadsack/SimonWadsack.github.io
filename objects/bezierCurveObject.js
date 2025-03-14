import * as THREE from 'three';
import { VisualObject } from './visualObject.js';
import { BezierCurve } from '../utils/curves/bezierCurve.js';
import { getSelectedColor, getHighlightColor } from '../core/vars.js';

class BezierCurveObject extends VisualObject {
    controlPoints;
    segments;
    radius;
    radialSegments;
    curve;
    connectionVisual;
    constructor(name, controlPoints = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(0, 5, 0), new THREE.Vector3(5, 0, 0)], color = new THREE.Color(0x000000), segments = 100) {
        super(name);
        this.controlPoints = controlPoints;
        this.color = color;
        this.segments = segments;
        this.radius = 0.05;
        this.radialSegments = 8;
        this.type = 'BezierCurveObject';
        this.curve = new BezierCurve(controlPoints);
        this.geometry = new THREE.TubeGeometry(this.curve, segments, this.radius, this.radialSegments, false);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
        this.material.side = THREE.DoubleSide;
        this.setMesh(new THREE.Mesh(this.geometry, this.material));
        this.connectionVisual = null;
    }
    //#region Editing
    edit() {
        if (!this.checkMesh("bezierCurveObject:edit"))
            return () => { console.error("bezierCurveObject:edit failed"); };
        for (let i = 0; i < this.controlPoints.length; i++) {
            this.createEditHandle(i);
            this.setEditHandlePosition(i, this.controlPoints[i]);
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(this.controlPoints);
        const material = new THREE.LineBasicMaterial({ color: getSelectedColor() });
        const line = new THREE.Line(geometry, material);
        line.castShadow = true;
        this.connectionVisual = line;
        this.mesh.add(line);
        return this.editUpdate.bind(this);
    }
    editUpdate() {
        if (this.connectionVisual === null)
            return;
        for (let i = 0; i < this.controlPoints.length; i++) {
            const handlePosition = this.getEditHandlePosition(i);
            if (handlePosition === null)
                continue;
            this.updateControlPoint(i, handlePosition);
            this.connectionVisual.geometry.setFromPoints(this.controlPoints);
        }
    }
    unedit() {
        if (!this.checkMesh("bezierCurveObject:unedit"))
            return;
        if (this.connectionVisual === null)
            return;
        this.removeEditHandles();
        this.mesh.remove(this.connectionVisual);
        this.connectionVisual = null;
    }
    //#endregion
    //#region Updates
    updateSegments(segments) {
        this.segments = segments;
        this.recompute();
    }
    updateColor(color) {
        if (!this.checkMaterial("bezierCurveObject:updateColor"))
            return;
        super.setColor(color);
        this.material.color.set(color);
    }
    //#endregion
    //#region Control Points
    addControlPoint(point) {
        this.controlPoints.push(point);
        this.recompute();
        this.updateConnectionVisual();
        this.createEditHandle(this.controlPoints.length - 1);
        this.setEditHandlePosition(this.controlPoints.length - 1, point);
    }
    removeControlPoint(index) {
        if (this.controlPoints.length < 3)
            return;
        this.controlPoints.splice(index, 1);
        this.recompute();
        this.updateConnectionVisual();
        if (this.hasEditHandle(index)) {
            this.removeEditHandle(index);
        }
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
    //#region Highlight and Select (Override)
    highlight() {
        if (!this.checkMaterial("highlight"))
            return;
        this.material.color.set(getHighlightColor());
    }
    resetHighlight() {
        this.resetColor();
    }
    select() {
        if (!this.checkMaterial("select"))
            return;
        this.material.color.set(getSelectedColor());
    }
    resetSelect() {
        this.resetColor();
    }
    resetColor() {
        if (!this.checkMaterial("resetColor"))
            return;
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
        if (!this.checkMesh("bezierCurveObject:recompute"))
            return;
        this.curve.setPoints(this.controlPoints);
        if (this.geometry)
            this.geometry.dispose();
        this.geometry = new THREE.TubeGeometry(this.curve, this.segments, this.radius, this.radialSegments, false);
        this.mesh.geometry = this.geometry;
    }
}

export { BezierCurveObject };
