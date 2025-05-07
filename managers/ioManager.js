import { App } from '../core/app.js';

class IOManager {
    constructor() { }
    saveSceneToFile(fileName) {
        const file = new Blob([this.objectsToJSON()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
        App.getInteractionsManager().toast('Scene saved', 'Scene saved successfully!', 'success');
    }
    saveSceneToCache() {
        localStorage.setItem('scene', this.objectsToJSON());
    }
    loadSceneFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.svis';
        input.onchange = (event) => {
            try {
                const target = event.target;
                const file = target.files?.item(0);
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const target = event.target;
                        this.objectsFromJSON(target.result);
                    };
                    reader.readAsText(file);
                }
            }
            catch (e) {
                console.warn("Error while loading JSON file: ", e);
            }
        };
        input.click();
    }
    loadSceneFromCache() {
        const data = localStorage.getItem('scene');
        if (data) {
            this.objectsFromJSON(data, true);
        }
    }
    clearSceneCache() {
        localStorage.removeItem('scene');
    }
    setFlagCache(flag, value) {
        localStorage.setItem(flag, value.toString());
    }
    getFlagCache(flag) {
        const value = localStorage.getItem(flag);
        return value ? value === 'true' : false;
    }
    objectsToJSON() {
        return JSON.stringify({ '2d': App.dimension2D(), objects: App.getObjectManager().getObjects().map(obj => obj.toJSON()) }, null, 1);
    }
    objectsFromJSON(jsonString, restored = false) {
        try {
            const data = JSON.parse(jsonString);
            if (data['2d'] == null || data['2d'] == undefined) {
                throw new Error('Could not find the 2d flag in the JSON file!');
            }
            if (data.objects == null || data.objects == undefined) {
                throw new Error('Could not find the objects array in the JSON file!');
            }
            if ((data['2d'] && !App.dimension2D()) || (!data['2d'] && App.dimension2D())) {
                App.switchDimension();
            }
            for (const obj of data.objects) {
                VisualObjectFactory.createVisualObject(obj);
            }
            if (!restored)
                App.getInteractionsManager().toast('Scene loaded', 'Scene loaded successfully!', 'success');
            else if (data.objects && data.objects.length > 0)
                App.getInteractionsManager().toast('Last Session restored', 'The Last Session was restored successfully!', 'success');
        }
        catch (e) {
            console.error("Error while loading JSON file: ", e);
            App.getInteractionsManager().toast('Error', 'Error while loading JSON file: <br />' + e, 'error');
        }
    }
}
class VisualObjectFactory {
    static createVisualObject(obj) {
        const type = obj.type;
        if (!type) {
            console.warn('Object type not found!');
            return;
        }
        switch (type) {
            case 'LinearCurveObject':
                App.getCreationManager().createJSONLinearCurve(obj);
                break;
            case 'BezierCurveObject':
                App.getCreationManager().createJSONBezierCurve(obj);
                break;
            case 'BezierSplineObject':
                App.getCreationManager().createJSONBezierSpline(obj);
                break;
            case 'UniformBSplineObject':
                App.getCreationManager().createJSONUniformBSpline(obj);
                break;
            case 'UniformRationBSplineObject':
                App.getCreationManager().createJSONURBS(obj);
                break;
            case 'BezierPatchObject':
                App.getCreationManager().createJSONBezierPatch(obj);
                break;
            case 'UniformBSplineSurfaceObject':
                App.getCreationManager().createJSONUniformBSplineSurface(obj);
                break;
            case 'UniformRationalBSplineSurfaceObject':
                App.getCreationManager().createJSONUniformRationalBSplineSurface(obj);
                break;
            default:
                console.warn(`Unknown object type: ${type}`);
                break;
        }
    }
}

export { IOManager };
