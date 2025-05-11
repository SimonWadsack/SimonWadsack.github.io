import * as THREE from 'three';
import { VisualObject } from './visualObject.js';
import { getSelectedColor, getHighlightColor } from '../core/vars.js';
import { UniformRationalBSplineCurve } from '../utils/curves/uniformRationalBSplineCurve.js';
import { App } from '../core/app.js';
import { EventBus } from '../core/events.js';
import { remap } from '../utils/math.js';

var UniformRationalBSplineObjectMode;
(function (UniformRationalBSplineObjectMode) {
    UniformRationalBSplineObjectMode[UniformRationalBSplineObjectMode["OBJECT"] = 0] = "OBJECT";
    UniformRationalBSplineObjectMode[UniformRationalBSplineObjectMode["CONTROL_POINTS"] = 1] = "CONTROL_POINTS";
})(UniformRationalBSplineObjectMode || (UniformRationalBSplineObjectMode = {}));
class UniformRationalBSplineObject extends VisualObject {
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
    weightEditIndex = -1;
    weightEditRing;
    closed = false;
    constructor(name, controlPoints = [new THREE.Vector4(-5, 0, 0, 1), new THREE.Vector4(0, 5, 0, 1), new THREE.Vector4(5, 0, 0, 1)], degree = 2, color = new THREE.Color(0x000000), segments = 100, position = new THREE.Vector3(0, 0, 0), mode = UniformRationalBSplineObjectMode.CONTROL_POINTS, closed = false) {
        const curve = new UniformRationalBSplineCurve(controlPoints, degree, closed);
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
        this.closed = closed;
        this.radius = radius;
        this.radialSegments = radialSegments;
        this.type = 'UniformRationBSplineObject';
        //Setup control point mode
        for (let i = 0; i < this.controlPoints.length; i++) {
            this.createEditHandle(i);
            const point = new THREE.Vector3(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);
            this.setEditHandlePosition(i, point);
        }
        const visualGeometry = new THREE.BufferGeometry().setFromPoints(this.controlPoints.map((point) => new THREE.Vector3(point.x, point.y, point.z)));
        const visualMaterial = new THREE.LineBasicMaterial({ color: getSelectedColor() });
        this.connectionVisual = new THREE.Line(visualGeometry, visualMaterial);
        this.connectionVisual.castShadow = true;
        mesh.add(this.connectionVisual);
        this.connectionVisual.visible = false;
        this.hideEditHandles();
        //weight edit ring
        const weightEditGeometry = new THREE.RingGeometry(0.05, 0.06, 32);
        const weightEditMaterial = new THREE.MeshBasicMaterial({ color: getSelectedColor() });
        this.weightEditRing = new THREE.Mesh(weightEditGeometry, weightEditMaterial);
        mesh.add(this.weightEditRing);
        this.weightEditRing.visible = false;
        App.onOrbitControlsChange(() => {
            if (this.weightEditIndex !== -1) {
                this.weightEditRing.lookAt(App.getCamera().position);
            }
        });
        window.addEventListener('wheel', (event) => {
            if (this.weightEditIndex !== -1) {
                const point = this.controlPoints[this.weightEditIndex];
                point.w += event.deltaY * 0.01;
                if (point.w < 1)
                    point.w = 1;
                if (point.w > 10)
                    point.w = 10;
                this.updateControlPoint(this.weightEditIndex, point);
                EventBus.notify('objectChanged', "viewport" /* EEnv.VIEWPORT */, this);
            }
        });
    }
    //#region Modes
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
        if (mode === UniformRationalBSplineObjectMode.OBJECT) {
            this.connectionVisual.visible = false;
            this.hideWeightEditRing();
            this.hideEditHandles();
        }
        else if (mode === UniformRationalBSplineObjectMode.CONTROL_POINTS) {
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
            controlPoints: this.controlPoints.map((point) => ({ x: point.x, y: point.y, z: point.z, w: point.w })),
            degree: this.degree,
            color: this.color.getHex(),
            segments: this.segments,
            mode: this.mode,
            closed: this.closed,
        };
    }
    static fromJSON(json) {
        const controlPoints = json.controlPoints.map((point) => new THREE.Vector4(point.x, point.y, point.z, point.w));
        const color = new THREE.Color(json.color);
        const position = new THREE.Vector3(json.position.x, json.position.y, json.position.z);
        const mode = json.mode;
        if (UniformRationalBSplineObjectMode[mode] === undefined)
            throw new Error("Invalid UniformBSplineObject mode");
        return new UniformRationalBSplineObject(json.name, controlPoints, json.degree, color, json.segments, position, mode, json.closed);
    }
    //#endregion
    //#region Editing
    edit() {
        return this.editUpdate.bind(this);
    }
    editUpdate() {
        if (this.mode === UniformRationalBSplineObjectMode.CONTROL_POINTS) {
            const index = App.getSelectionManager().getSelectedEditHandleIndex();
            if (index === null)
                return;
            const handlePosition = this.getEditHandlePosition(index);
            if (handlePosition === null)
                return;
            this.updateControlPoint3(index, handlePosition);
            this.updateConnectionVisual();
        }
    }
    unedit() {
        this.connectionVisual.visible = false;
        this.hideWeightEditRing();
        this.hideEditHandles();
    }
    showWeightEditRing(index) {
        this.weightEditIndex = index;
        this.updateWeightEditRing();
        this.weightEditRing.visible = true;
        App.noScroll();
    }
    hideWeightEditRing() {
        this.weightEditIndex = -1;
        this.weightEditRing.visible = false;
        App.scroll();
    }
    updateWeightEditRing() {
        if (this.weightEditIndex === -1)
            return;
        const point = this.controlPoints[this.weightEditIndex];
        this.weightEditRing.position.set(point.x, point.y, point.z);
        const scale = remap(point.w, 1, 10, 8, 20);
        this.weightEditRing.scale.set(scale, scale, scale);
        this.weightEditRing.lookAt(App.getCamera().position);
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
                const point3 = new THREE.Vector3(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);
                this.setEditHandlePosition(i, point3);
            }
        }
        else {
            this.createEditHandle(this.controlPoints.length - 1);
            const i = this.controlPoints.length - 1;
            const point3 = new THREE.Vector3(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);
            this.setEditHandlePosition(this.controlPoints.length - 1, point3);
        }
        if (this.controlPoints.length > 60)
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
        //check degree
        if (this.controlPoints.length - 1 < this.degree) {
            this.degree = this.controlPoints.length - 1;
            this.curve.setDegree(this.degree);
        }
        this.recompute();
        this.updateConnectionVisual();
        if (atFront) {
            this.removeEditHandle(this.controlPoints.length);
            for (let i = 0; i < this.controlPoints.length; i++) {
                const point = new THREE.Vector3(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);
                this.setEditHandlePosition(i, point);
            }
        }
        else {
            this.removeEditHandle(this.controlPoints.length);
        }
        if (this.controlPoints.length < 30)
            this.updateSegments(100);
        else if (this.controlPoints.length < 60)
            this.updateSegments(500);
    }
    updateControlPoint3(index, point) {
        this.updateControlPoint(index, new THREE.Vector4(point.x, point.y, point.z, this.getControlPoint(index).w));
    }
    updateControlPoint(index, point) {
        this.controlPoints[index].set(point.x, point.y, point.z, point.w);
        this.recompute();
        this.updateConnectionVisual();
        if (this.hasEditHandle(index)) {
            const point3 = new THREE.Vector3(this.controlPoints[index].x, this.controlPoints[index].y, this.controlPoints[index].z);
            this.setEditHandlePosition(index, point3);
        }
        if (this.weightEditIndex === index) {
            this.updateWeightEditRing();
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
    //#region Closed
    isClosed() {
        return this.closed;
    }
    setClosed(closed) {
        this.closed = closed;
        this.curve.setClosed(closed);
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
    dispose() {
        this.material.dispose();
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
        this.connectionVisual.geometry = new THREE.BufferGeometry().setFromPoints(this.controlPoints.map((point) => new THREE.Vector3(point.x, point.y, point.z)));
    }
    recompute() {
        this.curve.setPoints(this.controlPoints);
        if (this.geometry)
            this.geometry.dispose();
        this.geometry = new THREE.TubeGeometry(this.curve, this.segments, this.radius, this.radialSegments, false);
        this.mesh.geometry = this.geometry;
    }
}

export { UniformRationalBSplineObject };
