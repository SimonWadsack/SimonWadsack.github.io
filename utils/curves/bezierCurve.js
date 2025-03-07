import { Curve, Vector3 } from 'three';
import { bezier } from '../bezier.js';

class BezierCurve extends Curve {
    controlPoints;
    constructor(controlPoints = []) {
        super();
        this.controlPoints = controlPoints;
    }
    getPoint(t, optionalTarget = new Vector3) {
        const point = optionalTarget;
        if (this.controlPoints.length < 2) {
            console.log("BezierCurve: Not enough control points!");
            return point;
        }
        const result = bezier(this.controlPoints, t);
        if (result === null) {
            console.log("BezierCurve:getPoint: Bezier calculation failed!");
            return point;
        }
        point.copy(result);
        return point;
    }
    setPoints(points) {
        this.controlPoints = points;
    }
    copy(source) {
        if (!(source instanceof BezierCurve)) {
            console.log("BezierCurve:copy: Source is not an instance of BezierCurve!");
            return this;
        }
        super.copy(source);
        //deep copy of control points
        this.controlPoints = source.controlPoints.map(p => p.clone());
        return this;
    }
    toJSON() {
        const data = super.toJSON();
        data.controlPoints = this.controlPoints.map(p => p.toArray());
        return data;
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.controlPoints = data.controlPoints.map(p => new Vector3().fromArray(p));
        return this;
    }
}

export { BezierCurve };
