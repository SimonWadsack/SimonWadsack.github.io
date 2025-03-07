import * as THREE from 'three';
import { VisualObject } from './visualObject.js';
import { BezierCurve } from '../utils/curves/bezierCurve.js';
import { getSelectedColor } from '../core/vars.js';

class BezierCurveObject extends VisualObject {
    controlPoints;
    color;
    segments;
    radius;
    radialSegments;
    curve;
    connectionVisual;
    constructor(name, controlPoints = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(0, 5, 0), new THREE.Vector3(5, 0, 0)], color = 0x000000, segments = 100) {
        super(name);
        this.controlPoints = controlPoints;
        this.color = color;
        this.segments = segments;
        this.radius = 0.05;
        this.radialSegments = 8;
        this.type = 'BezierCurveObject';
        this.curve = new BezierCurve(controlPoints);
        this.geometry = new THREE.TubeGeometry(this.curve, segments, this.radius, this.radialSegments, false);
        this.material = new THREE.MeshBasicMaterial({ color: color });
        this.material.side = THREE.DoubleSide;
        this.setMesh(new THREE.Mesh(this.geometry, this.material));
        this.connectionVisual = null;
    }
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
    addControlPoint(point) {
        this.controlPoints.push(point);
        this.recompute();
    }
    removeControlPoint(index) {
        this.controlPoints.splice(index, 1);
        this.recompute();
    }
    updateControlPoint(index, point) {
        this.controlPoints[index] = point;
        this.recompute();
    }
    getControlPoint(index) {
        return this.controlPoints[index];
    }
    updateSegments(segments) {
        this.segments = segments;
        this.recompute();
    }
    updateColor(color) {
        if (!this.checkMaterial("bezierCurveObject:updateColor"))
            return;
        this.color = color;
        this.material.color.set(color);
    }
    resetColor() {
        if (!this.checkMaterial("resetColor"))
            return;
        this.material.color.set(this.color);
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
