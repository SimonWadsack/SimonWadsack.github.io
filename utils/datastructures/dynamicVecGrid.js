import * as THREE from 'three';
import { getSelectedColor } from '../../core/vars.js';

class DynamicVecGrid {
    data;
    width;
    height;
    texture;
    columnConnectionVisuals;
    rowConnectionVisuals;
    connectionParentMesh = null;
    connectionMaterial;
    constructor(initalWidth = 4, initialHeight = 4, bufferFactor = 1.25) {
        this.width = initalWidth;
        this.height = initialHeight;
        this.data = new Float32Array(this.width * this.height * 4);
        this.texture = new THREE.DataTexture(this.data, this.width, this.height, THREE.RGBAFormat, THREE.FloatType);
        this.texture.minFilter = this.texture.magFilter = THREE.NearestFilter;
        this.texture.needsUpdate = true;
        this.connectionMaterial = new THREE.LineBasicMaterial({ color: getSelectedColor(), depthTest: false, transparent: true });
        this.columnConnectionVisuals = [];
        for (let i = 0; i < this.width; i++) {
            const geometry = new THREE.BufferGeometry().setFromPoints(this.getColumn(i));
            const line = new THREE.Line(geometry, this.connectionMaterial);
            line.renderOrder = 1000;
            line.castShadow = true;
            this.columnConnectionVisuals.push(line);
        }
        this.rowConnectionVisuals = [];
        for (let i = 0; i < this.height; i++) {
            const geometry = new THREE.BufferGeometry().setFromPoints(this.getRow(i));
            const line = new THREE.Line(geometry, this.connectionMaterial);
            line.renderOrder = 1000;
            line.castShadow = true;
            this.rowConnectionVisuals.push(line);
        }
    }
    getTexture() {
        return this.texture;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    toString() {
        let str = `DynamicVec3Grid: ${this.width}x${this.height}\n`;
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const index = (row * this.width + col) * 4;
                str += `(${this.data[index].toFixed(2)}, ${this.data[index + 1].toFixed(2)}, ${this.data[index + 2].toFixed(2)}, ${this.data[index + 3].toFixed(2)}) `;
            }
            str += '\n';
        }
        return str;
    }
    addVisuals(mesh) {
        if (this.connectionParentMesh !== null)
            return;
        this.connectionParentMesh = mesh;
        for (let i = 0; i < this.width; i++) {
            this.columnConnectionVisuals[i].visible = false;
            mesh.add(this.columnConnectionVisuals[i]);
        }
        for (let i = 0; i < this.height; i++) {
            this.rowConnectionVisuals[i].visible = false;
            mesh.add(this.rowConnectionVisuals[i]);
        }
    }
    showVisuals() {
        for (let i = 0; i < this.width; i++) {
            this.columnConnectionVisuals[i].visible = true;
        }
        for (let i = 0; i < this.height; i++) {
            this.rowConnectionVisuals[i].visible = true;
        }
    }
    hideVisuals() {
        for (let i = 0; i < this.width; i++) {
            this.columnConnectionVisuals[i].visible = false;
        }
        for (let i = 0; i < this.height; i++) {
            this.rowConnectionVisuals[i].visible = false;
        }
    }
    getPoint4(row, col) {
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
            throw new Error('Index out of bounds');
        }
        const index = (row * this.width + col) * 4;
        return new THREE.Vector4(this.data[index], this.data[index + 1], this.data[index + 2], this.data[index + 3]);
    }
    getPoint(row, col) {
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
            throw new Error('Index out of bounds');
        }
        const index = (row * this.width + col) * 4;
        return new THREE.Vector3(this.data[index], this.data[index + 1], this.data[index + 2]);
    }
    getPoints4() {
        const points = [];
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const index = (row * this.width + col) * 4;
                points.push(new THREE.Vector4(this.data[index], this.data[index + 1], this.data[index + 2], this.data[index + 3]));
            }
        }
        return points;
    }
    getPoints() {
        const points = [];
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const index = (row * this.width + col) * 4;
                points.push(new THREE.Vector3(this.data[index], this.data[index + 1], this.data[index + 2]));
            }
        }
        return points;
    }
    setPoint4(row, col, point) {
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
            throw new Error('Index out of bounds');
        }
        const index = (row * this.width + col) * 4;
        this.data[index] = point.x;
        this.data[index + 1] = point.y;
        this.data[index + 2] = point.z;
        this.data[index + 3] = point.w;
        this.texture.needsUpdate = true;
        //update col and row visuals
        const columnGeometry = new THREE.BufferGeometry().setFromPoints(this.getColumn(col));
        this.columnConnectionVisuals[col].geometry.dispose();
        this.columnConnectionVisuals[col].geometry = columnGeometry;
        const rowGeometry = new THREE.BufferGeometry().setFromPoints(this.getRow(row));
        this.rowConnectionVisuals[row].geometry.dispose();
        this.rowConnectionVisuals[row].geometry = rowGeometry;
    }
    setPoint(row, col, point) {
        this.setPoint4(row, col, new THREE.Vector4(point.x, point.y, point.z, 1.0));
    }
    getColumn4(col) {
        if (col < 0 || col >= this.width) {
            throw new Error('Index out of bounds');
        }
        const column = [];
        for (let row = 0; row < this.height; row++) {
            const index = (row * this.width + col) * 4;
            column.push(new THREE.Vector4(this.data[index], this.data[index + 1], this.data[index + 2], this.data[index + 3]));
        }
        return column;
    }
    getColumn(col) {
        if (col < 0 || col >= this.width) {
            throw new Error('Index out of bounds');
        }
        const column = [];
        for (let row = 0; row < this.height; row++) {
            const index = (row * this.width + col) * 4;
            column.push(new THREE.Vector3(this.data[index], this.data[index + 1], this.data[index + 2]));
        }
        return column;
    }
    getRow4(row) {
        if (row < 0 || row >= this.height) {
            throw new Error('Index out of bounds');
        }
        const rowData = [];
        for (let col = 0; col < this.width; col++) {
            const index = (row * this.width + col) * 4;
            rowData.push(new THREE.Vector4(this.data[index], this.data[index + 1], this.data[index + 2], this.data[index + 3]));
        }
        return rowData;
    }
    getRow(row) {
        if (row < 0 || row >= this.height) {
            throw new Error('Index out of bounds');
        }
        const rowData = [];
        for (let col = 0; col < this.width; col++) {
            const index = (row * this.width + col) * 4;
            rowData.push(new THREE.Vector3(this.data[index], this.data[index + 1], this.data[index + 2]));
        }
        return rowData;
    }
    addColumn(offset, atStart = false) {
        this.resizeBuffer(this.width + 1, this.height);
        if (atStart) {
            this.shiftColumnRight();
        }
        const index = atStart ? 0 : this.width - 1;
        const beforeIndex = atStart ? 1 : this.width - 2;
        //update col visuals
        const columnGeometry = new THREE.BufferGeometry().setFromPoints(this.getColumn(index));
        const line = new THREE.Line(columnGeometry, this.connectionMaterial);
        line.renderOrder = 1000;
        line.castShadow = true;
        if (atStart)
            this.columnConnectionVisuals.unshift(line);
        else
            this.columnConnectionVisuals.push(line);
        this.connectionParentMesh?.add(this.columnConnectionVisuals[index]);
        //setting points
        const beforeCol = this.getColumn(beforeIndex);
        for (let row = 0; row < this.height; row++) {
            const point = beforeCol[row].clone().sub(offset);
            this.setPoint(row, index, point);
        }
    }
    removeColumn(atStart = false) {
        if (this.width <= 2)
            return;
        if (atStart) {
            this.shiftColumnLeft();
        }
        this.resizeBuffer(this.width - 1, this.height);
        //update column visuals
        if (atStart) {
            this.connectionParentMesh?.remove(this.columnConnectionVisuals[0]);
            this.columnConnectionVisuals.shift();
        }
        else {
            this.connectionParentMesh?.remove(this.columnConnectionVisuals[this.width]);
            this.columnConnectionVisuals.pop();
        }
        //go through all rows and update the visuals
        for (let i = 0; i < this.height; i++) {
            const geometry = new THREE.BufferGeometry().setFromPoints(this.getRow(i));
            this.rowConnectionVisuals[i].geometry.dispose();
            this.rowConnectionVisuals[i].geometry = geometry;
        }
    }
    addRow(offset, atStart = false) {
        this.resizeBuffer(this.width, this.height + 1);
        if (atStart) {
            this.shiftRowDown();
        }
        const index = atStart ? 0 : this.height - 1;
        const beforeIndex = atStart ? 1 : this.height - 2;
        //update row visuals
        const rowGeometry = new THREE.BufferGeometry().setFromPoints(this.getRow(index));
        const line = new THREE.Line(rowGeometry, this.connectionMaterial);
        line.renderOrder = 1000;
        line.castShadow = true;
        if (atStart)
            this.rowConnectionVisuals.unshift(line);
        else
            this.rowConnectionVisuals.push(line);
        this.connectionParentMesh?.add(this.rowConnectionVisuals[index]);
        //setting points
        const beforeRow = this.getRow(beforeIndex);
        for (let col = 0; col < this.width; col++) {
            const point = beforeRow[col].clone().sub(offset);
            this.setPoint(index, col, point);
        }
    }
    removeRow(atStart = false) {
        if (this.height <= 2)
            return;
        if (atStart) {
            this.shiftRowUp();
        }
        this.resizeBuffer(this.width, this.height - 1);
        //update row visuals
        if (atStart) {
            this.connectionParentMesh?.remove(this.rowConnectionVisuals[0]);
            this.rowConnectionVisuals.shift();
        }
        else {
            this.connectionParentMesh?.remove(this.rowConnectionVisuals[this.height]);
            this.rowConnectionVisuals.pop();
        }
        //go through all columns and update the visuals
        for (let i = 0; i < this.width; i++) {
            const geometry = new THREE.BufferGeometry().setFromPoints(this.getColumn(i));
            this.columnConnectionVisuals[i].geometry.dispose();
            this.columnConnectionVisuals[i].geometry = geometry;
        }
    }
    shiftColumnRight() {
        for (let row = 0; row < this.height; row++) {
            for (let col = this.width - 1; col > 0; col--) {
                const destIndex = (row * this.width + col) * 4;
                const srcIndex = (row * this.width + (col - 1)) * 4;
                this.data.set(this.data.slice(srcIndex, srcIndex + 4), destIndex);
            }
        }
    }
    shiftColumnLeft() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width - 1; col++) {
                const destIndex = (row * this.width + col) * 4;
                const srcIndex = (row * this.width + (col + 1)) * 4;
                this.data.set(this.data.slice(srcIndex, srcIndex + 4), destIndex);
            }
        }
    }
    shiftRowDown() {
        for (let row = this.height - 1; row > 0; row--) {
            for (let col = 0; col < this.width; col++) {
                const destIndex = (row * this.width + col) * 4;
                const srcIndex = ((row - 1) * this.width + col) * 4;
                this.data.set(this.data.slice(srcIndex, srcIndex + 4), destIndex);
            }
        }
    }
    shiftRowUp() {
        for (let row = 0; row < this.height - 1; row++) {
            for (let col = 0; col < this.width; col++) {
                const destIndex = (row * this.width + col) * 4;
                const srcIndex = ((row + 1) * this.width + col) * 4;
                this.data.set(this.data.slice(srcIndex, srcIndex + 4), destIndex);
            }
        }
    }
    resizeBuffer(newWidth, newHeight) {
        const newData = new Float32Array(newWidth * newHeight * 4);
        for (let row = 0; row < this.height; row++) {
            if (row >= newHeight)
                break;
            for (let col = 0; col < this.width; col++) {
                if (col >= newWidth)
                    break;
                const oldIndex = (row * this.width + col) * 4;
                const newIndex = (row * newWidth + col) * 4;
                newData.set(this.data.slice(oldIndex, oldIndex + 4), newIndex);
            }
        }
        this.width = newWidth;
        this.height = newHeight;
        this.data = newData;
        this.texture.dispose();
        this.texture = new THREE.DataTexture(this.data, newWidth, newHeight, THREE.RGBAFormat, THREE.FloatType);
        this.texture.needsUpdate = true;
    }
}

export { DynamicVecGrid };
