import { Curve, Vector3 } from 'three';
import { uniformKnotVector } from '../basis.js';
import { rationalbspline } from '../rationalbspline.js';

class UniformRationalBSplineCurve extends Curve {
    controlPoints;
    degree;
    knots;
    closed;
    constructor(controlPoints = [], degree = 2, closed = false) {
        super();
        this.controlPoints = controlPoints;
        this.degree = degree;
        this.closed = closed;
        const closedAdd = this.closed ? this.degree : 0;
        this.knots = uniformKnotVector(this.degree, this.controlPoints.length - 1 + closedAdd);
    }
    getPoint(t, optionalTarget = new Vector3) {
        const point = optionalTarget;
        if (this.controlPoints.length < 3) {
            console.log("UniformRationalBSplineCurve: Not enough control points!");
            return point;
        }
        if (this.degree < 2 || this.degree > this.controlPoints.length - 1) {
            console.log("UniformRationalBSplineCurve: Degree is out of range!");
            return point;
        }
        t = this.knots[this.degree] + t * (this.knots[this.knots.length - this.degree - 1] - this.knots[this.degree]);
        const result = rationalbspline(this.controlPoints, t, this.degree, this.knots, this.closed);
        if (result === null) {
            console.log("UniformRationalBSplineCurve:getPoint: BSpline calculation failed!");
            return point;
        }
        point.copy(result);
        return point;
    }
    setPoints(points) {
        this.controlPoints = points;
        const closedAdd = this.closed ? this.degree : 0;
        this.knots = uniformKnotVector(this.degree, this.controlPoints.length - 1 + closedAdd);
    }
    setDegree(degree) {
        if (this.degree === degree)
            return;
        this.degree = degree;
        const closedAdd = this.closed ? this.degree : 0;
        this.knots = uniformKnotVector(this.degree, this.controlPoints.length - 1 + closedAdd);
    }
    setClosed(closed) {
        if (this.closed === closed)
            return;
        this.closed = closed;
        const closedAdd = this.closed ? this.degree : 0;
        this.knots = uniformKnotVector(this.degree, this.controlPoints.length - 1 + closedAdd);
    }
    copy(source) {
        if (!(source instanceof UniformRationalBSplineCurve)) {
            console.log("UniformRationalBSplineCurve:copy: Source is not an instance of UniformBSplineCurve!");
            return this;
        }
        super.copy(source);
        //deep copy of control points
        this.controlPoints = source.controlPoints.map(p => p.clone());
        this.degree = source.degree;
        this.knots = source.knots.slice();
        this.closed = source.closed;
        return this;
    }
}

export { UniformRationalBSplineCurve };
