import * as THREE from 'three';
import { DynamicVecGrid } from '../utils/datastructures/dynamicVecGrid.js';
import { VisualObject } from './visualObject.js';
import { App } from '../core/app.js';
import { getHighlightColor } from '../core/vars.js';
import { createGridGeometry } from '../utils/surfaces/gridSurface.js';
import { bsplineSurfaceFragmentShader, bsplineSurfaceVertexShader } from '../utils/shaders/bsplineSurfaceShader.js';
import { uniformBSplineSurface } from '../utils/surfaces/bsplineSurface.js';

var UniformBSplineSurfaceObjectMode;
(function (UniformBSplineSurfaceObjectMode) {
    UniformBSplineSurfaceObjectMode[UniformBSplineSurfaceObjectMode["OBJECT"] = 0] = "OBJECT";
    UniformBSplineSurfaceObjectMode[UniformBSplineSurfaceObjectMode["CONTROL_POINTS"] = 1] = "CONTROL_POINTS";
})(UniformBSplineSurfaceObjectMode || (UniformBSplineSurfaceObjectMode = {}));
class UniformBSplineSurfaceObject extends VisualObject {
    mode;
    controlPoints;
    degree;
    geometry;
    material;
    collisionGeometry;
    collisionMesh;
    radius = 0.1;
    closedU;
    closedV;
    constructor(name, controlPoints, controlPointsWidth, controlPointsHeight, degree = 2, color = new THREE.Color(0x000000), position = new THREE.Vector3(0, 0, 0), mode = UniformBSplineSurfaceObjectMode.CONTROL_POINTS, closedU = false, closedV = false) {
        if (closedU && closedV)
            throw new Error("Cannot have both closedU and closedV set to true. Please set one of them to false.");
        const grid = new DynamicVecGrid(controlPointsWidth, controlPointsHeight);
        for (let i = 0; i < controlPointsWidth; i++) {
            for (let j = 0; j < controlPointsHeight; j++) {
                const index = i + j * controlPointsWidth;
                grid.setPoint(j, i, controlPoints[index]);
            }
        }
        const geometry = new THREE.PlaneGeometry(0, 0, 100, 100);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                controlPointsTexture: { value: grid.getTexture() },
                controlPointsWidth: { value: controlPointsWidth },
                controlPointsHeight: { value: controlPointsHeight },
                color: { value: color.clone() },
                degree: { value: degree },
                closedU: { value: closedU },
                closedV: { value: closedV },
                lightDirection: { value: App.getDirectionalLight().position.clone() },
                lightColor: { value: App.getDirectionalLight().color.clone() },
                lightIntensity: { value: App.getDirectionalLight().intensity },
                ambientIntensity: { value: App.getAmbientLight().intensity },
                ambientColor: { value: App.getAmbientLight().color.clone() },
                specularIntensity: { value: 0.3 },
                specularPower: { value: 16.0 },
            },
            vertexShader: bsplineSurfaceVertexShader(),
            fragmentShader: bsplineSurfaceFragmentShader(),
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        super(name, mesh, position);
        this.controlPoints = grid;
        this.geometry = geometry;
        this.material = material;
        this.mode = mode;
        this.color = color;
        this.degree = degree;
        this.closedU = closedU;
        this.closedV = closedV;
        this.type = "UniformBSplineSurfaceObject";
        this.export = this.exportMesh.bind(this);
        //Setup control point mode
        for (let i = 0; i < controlPointsWidth; i++) {
            for (let j = 0; j < controlPointsHeight; j++) {
                const index = i + j * controlPointsWidth;
                this.createEditHandle(index, this.radius);
                this.setEditHandlePosition(index, controlPoints[index]);
            }
        }
        this.hideEditHandles();
        this.controlPoints.addVisuals(this.mesh);
        //Setup collision geometry
        const width = this.controlPoints.getWidth() + 3;
        const height = this.controlPoints.getHeight() + 3;
        this.collisionGeometry = createGridGeometry(uniformBSplineSurface(this.controlPoints, width, height, this.degree, this.closedU, this.closedV), width, height);
        this.collisionMesh = new THREE.Mesh(this.collisionGeometry, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, visible: false, side: THREE.DoubleSide }));
        this.collisionMesh.userData.collision = true;
        this.collisionMesh.userData.object = this;
        this.mesh.add(this.collisionMesh);
    }
    //#region Modes
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
        if (this.mode === UniformBSplineSurfaceObjectMode.OBJECT) {
            this.hideEditHandles();
            this.controlPoints.hideVisuals();
        }
        else if (this.mode === UniformBSplineSurfaceObjectMode.CONTROL_POINTS) {
            this.showEditHandles();
            this.controlPoints.showVisuals();
        }
    }
    //#endregion
    //#region JSON
    toJSON() {
        return {
            name: this.name,
            type: this.type,
            position: { x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z },
            controlPoints: this.controlPoints.getPoints().map((point) => ({ x: point.x, y: point.y, z: point.z })),
            controlPointsWidth: this.controlPoints.getWidth(),
            controlPointsHeight: this.controlPoints.getHeight(),
            degree: this.degree,
            color: this.color.getHex(),
            mode: this.mode,
            closedU: this.closedU,
            closedV: this.closedV,
        };
    }
    static fromJSON(json) {
        const controlPoints = json.controlPoints.map((point) => new THREE.Vector3(point.x, point.y, point.z));
        const color = new THREE.Color(json.color);
        const position = new THREE.Vector3(json.position.x, json.position.y, json.position.z);
        const mode = json.mode;
        if (UniformBSplineSurfaceObjectMode[mode] === undefined)
            throw new Error("Invalid UniformBSplineSurfaceObjectMode mode");
        const object = new UniformBSplineSurfaceObject(json.name, controlPoints, json.controlPointsWidth, json.controlPointsHeight, json.degree, color, position, mode, json.closedU, json.closedV);
        return object;
    }
    //#endregion
    //#region Editing
    edit() {
        this.collisionMesh.userData.collision = false;
        return this.editUpdate.bind(this);
    }
    editUpdate() {
        if (this.mode === UniformBSplineSurfaceObjectMode.CONTROL_POINTS) {
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
        this.controlPoints.hideVisuals();
        this.collisionMesh.userData.collision = true;
    }
    //#endregion
    //#region Updates
    updateColor(color) {
        super.setColor(color);
        this.material.uniforms.color.value.set(this.color);
    }
    //#endregion
    //#region Control Points
    addControlPoint(index, point) {
        if (!this.hasEditHandle(index))
            return;
        const position = this.getEditHandlePosition(index);
        if (position === null)
            return;
        const row = Math.floor(index / this.controlPoints.getWidth());
        const col = index % this.controlPoints.getWidth();
        const offset = position.clone().sub(point);
        const zOffset = new THREE.Vector3(0, offset.y, offset.z);
        const xOffset = new THREE.Vector3(offset.x, offset.y, 0);
        if (row === 0 && col === 0) {
            this.addControlPointRowCol(row, -1, zOffset);
            this.addControlPointRowCol(-1, col, xOffset);
        }
        else if (row === 0 && col === this.controlPoints.getWidth() - 1) {
            this.addControlPointRowCol(row, -1, zOffset);
            this.addControlPointRowCol(-1, col, xOffset);
        }
        else if (row === this.controlPoints.getHeight() - 1 && col === 0) {
            this.addControlPointRowCol(-1, col, xOffset);
            this.addControlPointRowCol(row, -1, zOffset);
        }
        else if (row === this.controlPoints.getHeight() - 1 && col === this.controlPoints.getWidth() - 1) {
            this.addControlPointRowCol(-1, col, xOffset);
            this.addControlPointRowCol(row, -1, zOffset);
        }
        else {
            this.addControlPointRowCol(row, col, offset);
        }
        //set all editHandle positions to the new control point positions
        for (let i = 0; i < this.controlPoints.getWidth(); i++) {
            for (let j = 0; j < this.controlPoints.getHeight(); j++) {
                const index = i + j * this.controlPoints.getWidth();
                this.setEditHandlePosition(index, this.controlPoints.getPoint(j, i));
            }
        }
        this.updateShader();
        this.updateCollisionGeometry();
    }
    addControlPointRowCol(row, col, offset) {
        var newPointsAmount = 0;
        var startIndex = 0;
        if (row === 0) {
            this.controlPoints.addRow(offset, true);
            newPointsAmount = this.controlPoints.getWidth();
            startIndex = this.controlPoints.getWidth() * (this.controlPoints.getHeight() - 1);
        }
        else if (row === this.controlPoints.getHeight() - 1) {
            this.controlPoints.addRow(offset, false);
            newPointsAmount = this.controlPoints.getWidth();
            startIndex = this.controlPoints.getWidth() * (this.controlPoints.getHeight() - 1);
        }
        else if (col === 0) {
            this.controlPoints.addColumn(offset, true);
            newPointsAmount = this.controlPoints.getHeight();
            startIndex = (this.controlPoints.getWidth() - 1) * this.controlPoints.getHeight();
        }
        else if (col === this.controlPoints.getWidth() - 1) {
            console.log("Adding column to the right");
            this.controlPoints.addColumn(offset, false);
            newPointsAmount = this.controlPoints.getHeight();
            startIndex = (this.controlPoints.getWidth() - 1) * this.controlPoints.getHeight();
        }
        for (let i = 0; i < newPointsAmount; i++) {
            this.createEditHandle(startIndex + i, this.radius);
        }
    }
    removeControlPoint(index) {
        if (this.controlPoints.getWidth() <= 3 || this.controlPoints.getHeight() <= 3)
            return;
        if (!this.hasEditHandle(index))
            return;
        const row = Math.floor(index / this.controlPoints.getWidth());
        const col = index % this.controlPoints.getWidth();
        if (row === 0 || col === 0 || row === this.controlPoints.getHeight() - 1 || col === this.controlPoints.getWidth() - 1) {
            this.removeControlPointRowCol(row, -1);
            this.removeControlPointRowCol(-1, col);
        }
        else {
            this.removeControlPointRowCol(row, col);
        }
        //set all editHandle positions to the new control point positions
        for (let i = 0; i < this.controlPoints.getWidth(); i++) {
            for (let j = 0; j < this.controlPoints.getHeight(); j++) {
                const index = i + j * this.controlPoints.getWidth();
                this.setEditHandlePosition(index, this.controlPoints.getPoint(j, i));
            }
        }
        //check degree
        if (this.getMaxDegree() < this.degree) {
            this.degree = this.getMaxDegree();
        }
        this.updateShader();
        this.updateCollisionGeometry();
    }
    removeControlPointRowCol(row, col) {
        var removePointsAmount = 0;
        var startIndex = 0;
        if (row === 0) {
            removePointsAmount = this.controlPoints.getWidth();
            startIndex = this.controlPoints.getWidth() * (this.controlPoints.getHeight() - 1);
            this.controlPoints.removeRow(true);
        }
        else if (row === this.controlPoints.getHeight() - 1) {
            removePointsAmount = this.controlPoints.getWidth();
            startIndex = this.controlPoints.getWidth() * (this.controlPoints.getHeight() - 1);
            this.controlPoints.removeRow(false);
        }
        else if (col === 0) {
            removePointsAmount = this.controlPoints.getHeight();
            startIndex = (this.controlPoints.getWidth() - 1) * this.controlPoints.getHeight();
            this.controlPoints.removeColumn(true);
        }
        else if (col === this.controlPoints.getWidth() - 1) {
            removePointsAmount = this.controlPoints.getHeight();
            startIndex = (this.controlPoints.getWidth() - 1) * this.controlPoints.getHeight();
            this.controlPoints.removeColumn(false);
        }
        for (let i = 0; i < removePointsAmount; i++) {
            this.removeEditHandle(startIndex + i);
        }
    }
    updateControlPoint(index, position) {
        const row = Math.floor(index / this.controlPoints.getWidth());
        const col = index % this.controlPoints.getWidth();
        this.controlPoints.setPoint(row, col, position);
        if (this.hasEditHandle(index)) {
            this.setEditHandlePosition(index, position);
        }
        this.updateCollisionGeometry();
    }
    getControlPoint(index) {
        const row = Math.floor(index / this.controlPoints.getWidth());
        const col = index % this.controlPoints.getWidth();
        return this.controlPoints.getPoint(row, col);
    }
    //#endregion
    //#region Hightlight and Select (Override)
    highlight() {
        this.material.uniforms.color.value.set(getHighlightColor());
    }
    resetHighlight() {
        this.resetColor();
    }
    select() {
        //this.material.uniforms.color.value.set(getSelectedColor());
        this.resetColor();
    }
    resetSelect() {
        this.resetColor();
    }
    resetColor() {
        this.material.uniforms.color.value.set(this.color);
    }
    //#endregion
    //#region Degree
    setDegree(degree) {
        this.degree = degree;
        this.updateShader();
        this.updateCollisionGeometry();
    }
    getDegree() {
        return this.degree;
    }
    getMaxDegree() {
        return Math.min(this.controlPoints.getWidth(), this.controlPoints.getHeight()) - 1;
    }
    //#region Closed
    setClosedU(closed) {
        this.closedU = closed;
        this.closedV = false; //if closedU is set to true, closedV must be false
        this.updateShader();
        this.updateCollisionGeometry();
    }
    setClosedV(closed) {
        this.closedV = closed;
        this.closedU = false; //if closedV is set to true, closedU must be false
        this.updateShader();
        this.updateCollisionGeometry();
    }
    getClosedU() {
        return this.closedU;
    }
    getClosedV() {
        return this.closedV;
    }
    //#endregion
    //#region Collision
    updateCollisionGeometry() {
        this.collisionGeometry.dispose();
        const width = this.controlPoints.getWidth() + 3;
        const height = this.controlPoints.getHeight() + 3;
        this.collisionGeometry = createGridGeometry(uniformBSplineSurface(this.controlPoints, width, height, this.degree, this.closedU, this.closedV), width, height);
        this.collisionMesh.geometry = this.collisionGeometry;
    }
    //#endregion
    //#region Export
    exportMesh() {
        const points = uniformBSplineSurface(this.controlPoints, 100, 100, this.degree, this.closedU, this.closedV);
        const geometry = createGridGeometry(points, 100, 100);
        const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.mesh.position);
        mesh.rotation.copy(this.mesh.rotation);
        mesh.scale.copy(this.mesh.scale);
        return mesh;
    }
    //#endregion
    //#region Private Methods
    updateShader() {
        this.material.uniforms.controlPointsTexture.value = this.controlPoints.getTexture();
        this.material.uniforms.controlPointsWidth.value = this.controlPoints.getWidth();
        this.material.uniforms.controlPointsHeight.value = this.controlPoints.getHeight();
        this.material.uniforms.degree.value = this.degree;
        this.material.uniforms.closedU.value = this.closedU;
        this.material.uniforms.closedV.value = this.closedV;
        this.material.needsUpdate = true;
    }
}

export { UniformBSplineSurfaceObject };
