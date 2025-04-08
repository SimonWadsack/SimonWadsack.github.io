import { Vector3 } from 'three';
import { bernstein } from '../bernstein.js';

function bezierPatch(controlPoints, uSegments, vSegments) {
    const points = [];
    for (let i = 0; i < vSegments; i++) {
        const v = i / (vSegments - 1);
        for (let j = 0; j < uSegments; j++) {
            const u = j / (uSegments - 1);
            points.push(bezierPatchStep(controlPoints, u, v));
        }
    }
    return points;
}
function bezierPatchStep(controlPoints, u, v) {
    const point = new Vector3(0, 0, 0);
    for (let i = 0; i < controlPoints.getWidth(); i++) {
        const bernsteinU = bernstein(controlPoints.getWidth() - 1, i, u);
        for (let j = 0; j < controlPoints.getHeight(); j++) {
            const controlPoint = controlPoints.getPoint(j, i);
            const bernsteinV = bernstein(controlPoints.getHeight() - 1, j, v);
            point.add(controlPoint.clone().multiplyScalar(bernsteinU * bernsteinV));
        }
    }
    return point;
}

export { bezierPatch };
