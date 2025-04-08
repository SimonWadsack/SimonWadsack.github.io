import { App } from '../core/app.js';
import { Group } from 'three';
import { OBJExporter, STLExporter, GLTFExporter } from 'three/examples/jsm/Addons.js';

var ExportType;
(function (ExportType) {
    ExportType["OBJ"] = "OBJ";
    ExportType["STL"] = "STL";
    ExportType["GLTF"] = "GLTF";
})(ExportType || (ExportType = {}));
class ExportManager {
    constructor() { }
    isExportable(object) {
        return object.getExport() !== null;
    }
    export(exportType) {
        this.exportDialog(exportType);
    }
    exportDialog(exportType) {
        const dialog = document.createElement('sl-dialog');
        dialog.label = 'Export to ' + exportType;
        dialog.classList.add('export-dialog');
        const messageText = document.createElement('div');
        messageText.innerHTML = "";
        dialog.appendChild(messageText);
        const selectedObject = App.getSelectionManager().getSelectedObject();
        const selected = selectedObject !== null && selectedObject !== undefined;
        if (selected) {
            const exportable = this.isExportable(selectedObject);
            if (exportable) {
                messageText.innerHTML += `Selected object <b> ${selectedObject.getName()} </b> can be exported to <b> ${exportType} </b>.<br>`;
                const exportButton = document.createElement('sl-button');
                exportButton.variant = 'primary';
                exportButton.innerText = 'Export Object';
                exportButton.slot = 'footer';
                exportButton.onclick = () => {
                    this.exportObject(selectedObject, exportType);
                    dialog.hide();
                };
                dialog.appendChild(exportButton);
            }
            else {
                messageText.innerHTML += `Selected object <b> ${selectedObject.getName()} </b> cannot be exported.<br>`;
            }
        }
        const exportableObjectExists = this.exportableObjectExists();
        if (exportableObjectExists) {
            messageText.innerHTML += 'Export all objects that can be exported.';
            const exportAllButton = document.createElement('sl-button');
            exportAllButton.variant = 'success';
            exportAllButton.innerText = 'Export All';
            exportAllButton.slot = 'footer';
            exportAllButton.onclick = () => {
                this.exportAll(exportType);
                dialog.hide();
            };
            dialog.appendChild(exportAllButton);
        }
        else {
            messageText.innerHTML += 'No exportable objects available.';
        }
        const cancelButton = document.createElement('sl-button');
        cancelButton.variant = 'danger';
        cancelButton.innerText = 'Cancel';
        cancelButton.slot = 'footer';
        cancelButton.onclick = () => {
            dialog.hide();
        };
        dialog.appendChild(cancelButton);
        document.body.appendChild(dialog);
        dialog.show();
    }
    exportableObjectExists() {
        const objects = App.getObjectManager().getObjects();
        for (const object of objects) {
            if (this.isExportable(object)) {
                return true;
            }
        }
        return false;
    }
    exportAll(exportType) {
        const group = new Group();
        const objects = App.getObjectManager().getObjects();
        for (const object of objects) {
            if (this.isExportable(object)) {
                const exportFunc = object.getExport();
                if (exportFunc !== null) {
                    const mesh = exportFunc();
                    if (mesh !== null) {
                        mesh.updateMatrixWorld(true);
                        group.add(mesh);
                    }
                }
            }
        }
        if (group.children.length > 0) {
            this.exportToType(group, 'exported_objects', exportType);
        }
        else {
            console.warn('No exportable objects found.');
        }
    }
    exportObject(object, exportType) {
        const exportFunc = object.getExport();
        if (exportFunc === null) {
            console.warn('Export function not available for this object.');
            return;
        }
        const mesh = exportFunc();
        if (mesh === null) {
            console.warn('Export function returned null mesh.');
            return;
        }
        this.exportToType(mesh, object.getName(), exportType);
    }
    exportToType(object, name, exportType) {
        switch (exportType) {
            case ExportType.OBJ:
                this.exportToOBJ(object, name);
                break;
            case ExportType.STL:
                this.exportToSTL(object, name);
                break;
            case ExportType.GLTF:
                this.exportToGLTF(object, name);
                break;
            default:
                console.warn('Export type not supported.');
                break;
        }
    }
    exportToOBJ(object, name) {
        const exporter = new OBJExporter();
        const data = exporter.parse(object);
        this.downloadFile(data, name.replaceAll(' ', '_') + '.obj');
    }
    exportToSTL(object, name) {
        const exporter = new STLExporter();
        const data = exporter.parse(object, { binary: false });
        this.downloadFile(data, name.replaceAll(' ', '_') + '.stl');
    }
    exportToGLTF(object, name) {
        const exporter = new GLTFExporter();
        exporter.parse(object, (gltf) => {
            // Convert the glb to a string
            const gltfString = JSON.stringify(gltf);
            this.downloadFile(gltfString, name.replaceAll(' ', '_') + '.gltf');
        }, (error) => {
            console.error('Error exporting to GLTF:', error);
        });
    }
    downloadFile(data, fileName) {
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

export { ExportManager, ExportType };
