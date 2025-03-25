import { Curve, Vector3 } from 'three';
import { cubicBezier } from '../bezier.js';

class BezierSplineCurve extends Curve {
    controlPoints;
    constructor(controlPoints = []) {
        super();
        this.controlPoints = controlPoints;
    }
    getPoint(t, optionalTarget = new Vector3) {
        const point = optionalTarget;
        if ((this.controlPoints.length - 1) % 3 !== 0) {
            console.log("BezierSplineCurve: Not 3p+1 control points!");
            return point;
        }
        const numSegments = (this.controlPoints.length - 1) / 3;
        const segment = Math.min(Math.floor(t * numSegments), numSegments - 1);
        const localT = (t - segment / numSegments) * numSegments;
        const i = segment * 3;
        const result = cubicBezier(this.controlPoints[i], this.controlPoints[i + 1], this.controlPoints[i + 2], this.controlPoints[i + 3], localT);
        if (result === null) {
            console.log("BezierSplineCurve:getPoint: Bezier calculation failed!");
            return point;
        }
        point.copy(result);
        return point;
    }
    setPoints(points) {
        this.controlPoints = points;
    }
    copy(source) {
        if (!(source instanceof BezierSplineCurve)) {
            console.log("BezierSplineCurve:copy: Source is not an instance of BezierCurve!");
            return this;
        }
        super.copy(source);
        //deep copy of control points
        this.controlPoints = source.controlPoints.map(p => p.clone());
        return this;
    }
}

export { BezierSplineCurve };
