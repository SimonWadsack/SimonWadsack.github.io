import { Vector3, Color, Vector4 } from 'three';
import { BezierCurveObject } from '../objects/bezierCurveObject.js';
import { App } from '../core/app.js';
import { LinearCurveObject } from '../objects/linearCurveObject.js';
import { UniformBSplineObject } from '../objects/uniformBSplineObject.js';
import { UniformRationalBSplineObject } from '../objects/uniformRationalBSplineObject.js';
import { BezierSplineObject } from '../objects/bezierSplineObject.js';

class CreationManager {
    constructor() {
    }
    createBasicLinearCurve() {
        const controlPoints = [new Vector3(-5, 0, 0), new Vector3(0, 5, -5), new Vector3(5, 0, 0)];
        const linearCurveObject = new LinearCurveObject('Linear Curve', controlPoints, new Color('#7f8c8d'));
        App.getObjectManager().addObject(linearCurveObject);
        return linearCurveObject;
    }
    createJSONLinearCurve(json) {
        const linearCurveObject = LinearCurveObject.fromJSON(json);
        App.getObjectManager().addObject(linearCurveObject);
        return linearCurveObject;
    }
    createBasicBezierCurve() {
        const controlPoints = [new Vector3(-5, 0, 0), new Vector3(0, 5, -5), new Vector3(5, 0, 0)];
        const bezierCurveObject = new BezierCurveObject('Bezier Curve', controlPoints, new Color('#7f8c8d'));
        App.getObjectManager().addObject(bezierCurveObject);
        return bezierCurveObject;
    }
    createJSONBezierCurve(json) {
        const bezierCurveObject = BezierCurveObject.fromJSON(json);
        App.getObjectManager().addObject(bezierCurveObject);
        return bezierCurveObject;
    }
    createBasicBezierSpline() {
        const controlPoints = [new Vector3(-5, 0, 0), new Vector3(-2, 5, -5), new Vector3(2, 5, -5), new Vector3(5, 0, 0)];
        const bezierSplineObject = new BezierSplineObject('Bezier Spline', controlPoints, new Color('#7f8c8d'));
        App.getObjectManager().addObject(bezierSplineObject);
        return bezierSplineObject;
    }
    createJSONBezierSpline(json) {
        const bezierSplineObject = BezierSplineObject.fromJSON(json);
        App.getObjectManager().addObject(bezierSplineObject);
        return bezierSplineObject;
    }
    createBasicUniformBSpline() {
        const controlPoints = [new Vector3(-5, 0, 0), new Vector3(0, 5, -5), new Vector3(5, 0, 0)];
        const uniformBSplineObject = new UniformBSplineObject('Uniform B-Spline', controlPoints, 2, new Color('#7f8c8d'));
        App.getObjectManager().addObject(uniformBSplineObject);
        return uniformBSplineObject;
    }
    createJSONUniformBSpline(json) {
        const uniformBSplineObject = UniformBSplineObject.fromJSON(json);
        App.getObjectManager().addObject(uniformBSplineObject);
        return uniformBSplineObject;
    }
    createBasicURBS() {
        const controlPoints = [new Vector4(-5, 0, 0, 1), new Vector4(0, 5, -5, 1), new Vector4(5, 0, 0, 1)];
        const uniformRationBSplineObject = new UniformRationalBSplineObject('Uniform Rational B-Spline', controlPoints, 2, new Color('#7f8c8d'));
        App.getObjectManager().addObject(uniformRationBSplineObject);
        return uniformRationBSplineObject;
    }
    createJSONURBS(json) {
        const uniformRationBSplineObject = UniformRationalBSplineObject.fromJSON(json);
        App.getObjectManager().addObject(uniformRationBSplineObject);
        return uniformRationBSplineObject;
    }
}

export { CreationManager };
