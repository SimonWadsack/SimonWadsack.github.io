import { Vector3 } from 'three';
import { uniformKnotVector, basis } from '../basis.js';

function uniformBSplineSurface(controlPoints, uSegments, vSegments, degree, closedU = false, closedV = false) {
    const points = [];
    const closedAddU = closedU ? degree : 0;
    const closedAddV = closedV ? degree : 0;
    const knotsU = uniformKnotVector(degree, controlPoints.getWidth() - 1 + closedAddU);
    const knotsV = uniformKnotVector(degree, controlPoints.getHeight() - 1 + closedAddV);
    for (let i = 0; i < vSegments; i++) {
        const v = i / (vSegments - 1);
        for (let j = 0; j < uSegments; j++) {
            const u = j / (uSegments - 1);
            points.push(uniformBSplineSurfaceStep(controlPoints, u, v, degree, knotsU, knotsV, closedU, closedV));
        }
    }
    return points;
}
function uniformBSplineSurfaceStep(controlPoints, u, v, degree, knotsU, knotsV, closedU = false, closedV = false) {
    const point = new Vector3(0, 0, 0);
    const closedAddU = closedU ? degree : 0;
    const closedAddV = closedV ? degree : 0;
    for (let i = 0; i < (controlPoints.getWidth() + closedAddU); i++) {
        const modU = knotsU[degree] + u * (knotsU[knotsU.length - degree - 1] - knotsU[degree]);
        const basisU = basis(degree, i, modU, knotsU);
        for (let j = 0; j < (controlPoints.getHeight() + closedAddV); j++) {
            const controlPoint = controlPoints.getPoint(j % controlPoints.getHeight(), i % controlPoints.getWidth());
            const modV = knotsV[degree] + v * (knotsV[knotsV.length - degree - 1] - knotsV[degree]);
            const basisV = basis(degree, j, modV, knotsV);
            point.add(controlPoint.clone().multiplyScalar(basisU * basisV));
        }
    }
    return point;
}
function uniformRationalBSplineSurface(controlPoints, uSegments, vSegments, degree, closedU = false, closedV = false) {
    const points = [];
    const closedAddU = closedU ? degree : 0;
    const closedAddV = closedV ? degree : 0;
    const knotsU = uniformKnotVector(degree, controlPoints.getWidth() - 1 + closedAddU);
    const knotsV = uniformKnotVector(degree, controlPoints.getHeight() - 1 + closedAddV);
    for (let i = 0; i < vSegments; i++) {
        const v = i / (vSegments - 1);
        for (let j = 0; j < uSegments; j++) {
            const u = j / (uSegments - 1);
            points.push(uniformRationalBSplineSurfaceStep(controlPoints, u, v, degree, knotsU, knotsV, closedU, closedV));
        }
    }
    return points;
}
function uniformRationalBSplineSurfaceStep(controlPoints, u, v, degree, knotsU, knotsV, closedU = false, closedV = false) {
    const numerator = new Vector3(0, 0, 0);
    var denominator = 0.0;
    const closedAddU = closedU ? degree : 0;
    const closedAddV = closedV ? degree : 0;
    for (let i = 0; i < (controlPoints.getWidth() + closedAddU); i++) {
        const modU = knotsU[degree] + u * (knotsU[knotsU.length - degree - 1] - knotsU[degree]);
        const basisU = basis(degree, i, modU, knotsU);
        for (let j = 0; j < (controlPoints.getHeight() + closedAddV); j++) {
            const controlPoint = controlPoints.getPoint(j % controlPoints.getHeight(), i % controlPoints.getWidth());
            const weight = controlPoints.getPoint4(j % controlPoints.getHeight(), i % controlPoints.getWidth()).w;
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
