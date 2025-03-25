import * as THREE from 'three';
import { VisualObject } from './visualObject.js';
import { BezierCurve } from '../utils/curves/bezierCurve.js';
import { getSelectedColor, getColorFromPalette, getHighlightColor } from '../core/vars.js';
import { lerp3D, lerp3DMesh } from '../utils/math.js';
import { App } from '../core/app.js';

var BezierCurveObjectMode;
(function (BezierCurveObjectMode) {
    BezierCurveObjectMode[BezierCurveObjectMode["OBJECT"] = 0] = "OBJECT";
    BezierCurveObjectMode[BezierCurveObjectMode["CONTROL_POINTS"] = 1] = "CONTROL_POINTS";
    BezierCurveObjectMode[BezierCurveObjectMode["DE_CASTELJAU"] = 2] = "DE_CASTELJAU";
})(BezierCurveObjectMode || (BezierCurveObjectMode = {}));
class BezierCurveObject extends VisualObject {
    mode;
    controlPoints;
    segments;
    radius;
    radialSegments;
    geometry;
    material;
    curve;
    connectionVisual;
    deCasteljauT;
    deCasteljauVisuals;
    deCasteljauCollisionMesh;
    constructor(name, controlPoints = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(0, 5, 0), new THREE.Vector3(5, 0, 0)], color = new THREE.Color(0x000000), segments = 100, position = new THREE.Vector3(0, 0, 0), mode = BezierCurveObjectMode.CONTROL_POINTS) {
        const curve = new BezierCurve(controlPoints);
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
        this.type = 'BezierCurveObject';
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
        //Setup De Casteljau mode
        this.deCasteljauT = 0.5;
        this.deCasteljauVisuals = [];
        const collisionGeometry = new THREE.TubeGeometry(this.curve, segments, this.radius * 10, this.radialSegments, false);
        const collisionMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, visible: false });
        this.deCasteljauCollisionMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
        mesh.add(this.deCasteljauCollisionMesh);
    }
    //#region Modes
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
        if (mode === BezierCurveObjectMode.OBJECT) {
            this.connectionVisual.visible = false;
            this.hideEditHandles();
            this.disableDeCasteljau();
        }
        else if (mode === BezierCurveObjectMode.CONTROL_POINTS) {
            this.connectionVisual.visible = true;
            this.showEditHandles();
            this.disableDeCasteljau();
        }
        else if (mode === BezierCurveObjectMode.DE_CASTELJAU) {
            this.connectionVisual.visible = false;
            this.hideEditHandles();
            this.enableDeCasteljau();
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
            mode: this.mode,
            deCasteljauT: this.deCasteljauT
        };
    }
    static fromJSON(json) {
        const controlPoints = json.controlPoints.map((point) => new THREE.Vector3(point.x, point.y, point.z));
        const color = new THREE.Color(json.color);
        const position = new THREE.Vector3(json.position.x, json.position.y, json.position.z);
        const mode = json.mode;
        if (BezierCurveObjectMode[mode] === undefined)
            throw new Error("Invalid BezierCurveObject mode");
        const object = new BezierCurveObject(json.name, controlPoints, color, json.segments, position, mode);
        if (mode === BezierCurveObjectMode.DE_CASTELJAU) {
            object.enableDeCasteljau();
            object.updateDeCasteljauT(json.deCasteljauT !== undefined ? json.deCasteljauT : 0.5);
        }
        return object;
    }
    //#endregion
    //#region Editing
    edit() {
        return this.editUpdate.bind(this);
    }
    editUpdate() {
        if (this.mode === BezierCurveObjectMode.CONTROL_POINTS) {
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
    //#region DeCasteljau
    enableDeCasteljau() {
        if (this.deCasteljauVisuals.length > 0)
            return;
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
        this.deCasteljauVisuals.forEach((visual) => {
            visual.points.forEach((point) => {
                this.mesh.remove(point);
            });
            this.mesh.remove(visual.line);
        });
        this.deCasteljauVisuals = [];
    }
    getDeCasteljauT() {
        return this.deCasteljauT;
    }
    updateDeCasteljauT(t) {
        this.deCasteljauT = t;
        this.recomputeDeCasteljau();
    }
    getCollisionMesh() {
        return this.deCasteljauCollisionMesh;
    }
    updateDeCasteljauFromNearestPoint(point) {
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
        if (this.mode !== BezierCurveObjectMode.DE_CASTELJAU)
            return;
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
        super.setColor(color);
        this.material.color.set(color);
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
        else if (this.controlPoints.length > 40)
            this.updateSegments(500);
    }
    removeControlPoint(atFront = false) {
        if (this.controlPoints.length <= 2)
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
        if (this.controlPoints.length < 40)
            this.updateSegments(100);
        else if (this.controlPoints.length < 100)
            this.updateSegments(500);
    }
    updateControlPoint(index, point) {
        this.controlPoints[index].set(point.x, point.y, point.z);
        this.recompute();
        this.updateConnectionVisual();
        if (this.mode === BezierCurveObjectMode.DE_CASTELJAU) {
            this.recomputeDeCasteljau();
        }
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
        this.deCasteljauCollisionMesh.geometry.dispose();
        this.deCasteljauCollisionMesh.geometry = new THREE.TubeGeometry(this.curve, this.segments, this.radius * 10, this.radialSegments, false);
    }
}

export { BezierCurveObject };
