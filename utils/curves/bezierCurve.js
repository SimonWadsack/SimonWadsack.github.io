import { Curve, Vector3 } from 'three';
import { bezier } from '../bezier.js';

class BezierCurve extends Curve{
    constructor(controlPoints = []){
        super();
        this.controlPoints = controlPoints;
    }

    getPoint(t, optionalTarget = new Vector3){
        const point = optionalTarget;

        if(this.controlPoints.length < 2){
            console.log("BezierCurve: Not enough control points!");
            return point;
        }
        
        const result = bezier(this.controlPoints, t);
        point.copy(result);

        return point;
    }

    setPoints(points){
        this.controlPoints = points;
    }

    copy(source){
        super.copy(source);
        this.controlPoints.copy(source.controlPoints);

        return this;
    }

    toJSON(){
        const data = super.toJSON();
        data.controlPoints = this.controlPoints;

        return data;
    }

    fromJSON(data){
        super.fromJSON(data);
        this.controlPoints = data.controlPoints;

        return this;
    }
}

export { BezierCurve };
