import * as THREE from 'three';
import { VisualObject } from './visualObject.js';
import { BezierCurve } from '../utils/curves/bezierCurve.js';
import { getSelectedColor, getColorFromPalette, getHighlightColor } from '../core/vars.js';
import { lerp3D, lerp3DMesh } from '../utils/math.js';

class BezierCurveObject extends VisualObject {
    controlPoints;
    segments;
    radius;
    radialSegments;
    curve;
    connectionVisual;
    deCasteljauActive;
    deCasteljauT;
    deCasteljauVisuals;
    deCasteljauCollisionMesh;
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
        const collisionGeometry = new THREE.TubeGeometry(this.curve, segments, this.radius * 10, this.radialSegments, false);
        this.deCasteljauCollisionMesh = new THREE.Mesh(collisionGeometry);
        this.connectionVisual = null;
        this.deCasteljauActive = false;
        this.deCasteljauT = 0.5;
        this.deCasteljauVisuals = [];
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
    //#region DeCasteljau
    enableDeCasteljau() {
        if (this.deCasteljauActive)
            return;
        if (!this.checkMesh("bezierCurveObject:enableDeCasteljau"))
            return;
        this.deCasteljauActive = true;
        const n = this.controlPoints.length;
        var lastPoints = [];
        const cpMeshes = [];
        const cpPoints = [];
        for (let i = 0; i < n; i++) {
            const geometry = new THREE.SphereGeometry(0.1);
            const material = new THREE.MeshBasicMaterial({ color: getColorFromPalette(0) });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);
            this.mesh.add(mesh);
            lastPoints.push(this.controlPoints[i]);
            cpMeshes.push(mesh);
            cpPoints.push(this.controlPoints[i]);
        }
        const cpLineGeometry = new THREE.BufferGeometry().setFromPoints(cpPoints);
        const cpLineMaterial = new THREE.LineBasicMaterial({ color: getColorFromPalette(0) });
        const cpLine = new THREE.Line(cpLineGeometry, cpLineMaterial);
        this.mesh.add(cpLine);
        this.deCasteljauVisuals[0] = { points: cpMeshes, line: cpLine };
        for (let i = 0; i < n - 1; i++) {
            const points = [];
            const meshes = [];
            const size = i === n - 2 ? 0.25 : 0.1;
            const color = i === n - 2 ? this.getColor() : getColorFromPalette(i + 1);
            for (let j = 0; j < n - i - 1; j++) {
                const point = lerp3D(lastPoints[j], lastPoints[j + 1], this.deCasteljauT);
                const geometry = new THREE.SphereGeometry(size);
                const material = new THREE.MeshBasicMaterial({ color: color });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(point.x, point.y, point.z);
                points.push(point);
                meshes.push(mesh);
                this.mesh.add(mesh);
            }
            lastPoints = points.slice();
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({ color: color });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            this.deCasteljauVisuals[i + 1] = { points: meshes, line: line };
            this.mesh.add(line);
        }
    }
    disableDeCasteljau() {
        if (!this.checkMesh("bezierCurveObject:disableDeCasteljau"))
            return;
        this.deCasteljauActive = false;
        this.deCasteljauVisuals.forEach((visual) => {
            visual.points.forEach((point) => {
                this.mesh.remove(point);
            });
            this.mesh.remove(visual.line);
        });
        this.deCasteljauVisuals = [];
    }
    getDeCasteljauActive() {
        return this.deCasteljauActive;
    }
    getDeCasteljauT() {
        return this.deCasteljauT;
    }
    updateDeCasteljauT(t) {
        if (!this.deCasteljauActive)
            return;
        this.deCasteljauT = t;
        this.recomputeDeCasteljau();
    }
    getCollisionMesh() {
        return this.deCasteljauCollisionMesh;
    }
    updateDeCasteljauFromNearestPoint(point) {
        if (!this.deCasteljauActive)
            return;
        const points = this.curve.getPoints(500);
        let minDist = Number.MAX_VALUE;
        let minIndex = 0;
        for (let i = 0; i < points.length; i++) {
            const dist = points[i].distanceToSquared(point);
            if (dist < minDist) {
                minDist = dist;
                minIndex = i;
            }
        }
        this.updateDeCasteljauT(minIndex / 500);
    }
    recomputeDeCasteljau() {
        for (let i = 0; i < this.deCasteljauVisuals[0].points.length; i++) {
            this.deCasteljauVisuals[0].points[i].position.set(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);
        }
        this.deCasteljauVisuals[0].line.geometry.setFromPoints(this.controlPoints);
        for (let i = 0; i < this.deCasteljauVisuals.length - 1; i++) {
            const lastPoints = this.deCasteljauVisuals[i].points;
            const nextPoints = this.deCasteljauVisuals[i + 1].points;
            for (let j = 0; j < lastPoints.length - 1; j++) {
                const point = lerp3DMesh(lastPoints[j], lastPoints[j + 1], this.deCasteljauT);
                nextPoints[j].position.set(point.x, point.y, point.z);
            }
            this.deCasteljauVisuals[i + 1].line.geometry.setFromPoints(nextPoints.map((point) => point.position));
        }
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
        if (this.deCasteljauActive) {
            this.recomputeDeCasteljau();
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
        if (!this.deCasteljauActive)
            this.disableDeCasteljau();
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
        this.deCasteljauCollisionMesh.geometry.dispose();
        this.deCasteljauCollisionMesh.geometry = new THREE.TubeGeometry(this.curve, this.segments, this.radius * 10, this.radialSegments, false);
    }
}

export { BezierCurveObject };
