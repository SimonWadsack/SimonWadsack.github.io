import { Vector3 } from 'three';
import { uniformKnotVector, basis } from '../basis.js';

function uniformBSplineSurface(controlPoints, uSegments, vSegments, degree) {
    const points = [];
    const knotsU = uniformKnotVector(degree, controlPoints.getWidth() - 1);
    const knotsV = uniformKnotVector(degree, controlPoints.getHeight() - 1);
    for (let i = 0; i < vSegments; i++) {
        const v = i / (vSegments - 1);
        for (let j = 0; j < uSegments; j++) {
            const u = j / (uSegments - 1);
            points.push(uniformBSplineSurfaceStep(controlPoints, u, v, degree, knotsU, knotsV));
        }
    }
    return points;
}
function uniformBSplineSurfaceStep(controlPoints, u, v, degree, knotsU, knotsV) {
    const point = new Vector3(0, 0, 0);
    for (let i = 0; i < controlPoints.getWidth(); i++) {
        const modU = knotsU[degree] + u * (knotsU[knotsU.length - degree - 1] - knotsU[degree]);
        const basisU = basis(degree, i, modU, knotsU);
        for (let j = 0; j < controlPoints.getHeight(); j++) {
            const controlPoint = controlPoints.getPoint(j, i);
            const modV = knotsV[degree] + v * (knotsV[knotsV.length - degree - 1] - knotsV[degree]);
            const basisV = basis(degree, j, modV, knotsV);
            point.add(controlPoint.clone().multiplyScalar(basisU * basisV));
        }
    }
    return point;
}
function uniformRationalBSplineSurface(controlPoints, uSegments, vSegments, degree) {
    const points = [];
    const knotsU = uniformKnotVector(degree, controlPoints.getWidth() - 1);
    const knotsV = uniformKnotVector(degree, controlPoints.getHeight() - 1);
    for (let i = 0; i < vSegments; i++) {
        const v = i / (vSegments - 1);
        for (let j = 0; j < uSegments; j++) {
            const u = j / (uSegments - 1);
            points.push(uniformRationalBSplineSurfaceStep(controlPoints, u, v, degree, knotsU, knotsV));
        }
    }
    return points;
}
function uniformRationalBSplineSurfaceStep(controlPoints, u, v, degree, knotsU, knotsV) {
    const numerator = new Vector3(0, 0, 0);
    var denominator = 0.0;
    for (let i = 0; i < controlPoints.getWidth(); i++) {
        const modU = knotsU[degree] + u * (knotsU[knotsU.length - degree - 1] - knotsU[degree]);
        const basisU = basis(degree, i, modU, knotsU);
        for (let j = 0; j < controlPoints.getHeight(); j++) {
            const controlPoint = controlPoints.getPoint(j, i);
            const weight = controlPoints.getPoint4(j, i).w;
            const modV = knotsV[degree] + v * (knotsV[knotsV.length - degree - 1] - knotsV[degree]);
            const basisV = basis(degree, j, modV, knotsV);
            const weightedBasis = weight * basisU * basisV;
            numerator.add(controlPoint.clone().multiplyScalar(weightedBasis));
            denominator += weightedBasis;
        }
    }
    return numerator.divideScalar(denominator);
}

export { uniformBSplineSurface, uniformRationalBSplineSurface };
