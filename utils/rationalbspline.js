import { Vector3 } from 'three';
import { basis } from './basis.js';

function rationalbspline(points, t, p, knots, close = false) {
    if (!points || !Array.isArray(points) || points.length < 2) {
        console.error('bspline: Invalid points array!');
        return null;
    }
    if (t < knots[0] || t > knots[knots.length - 1]) {
        console.error('bspline: Invalid t value!');
        return null;
    }
    let n = points.length - 1 + (close ? p : 0);
    if (knots.length !== n + p + 2) {
        console.error('bspline: Invalid knots array!');
        return null;
    }
    let numerator = new Vector3(0, 0, 0);
    let denominator = 0;
    for (let i = 0; i <= n; i++) {
        const b = basis(p, i, t, knots);
        const index = i % points.length;
        const point = new Vector3(points[index].x, points[index].y, points[index].z);
        const weightedB = points[index].w * b;
        numerator.addScaledVector(point, weightedB);
        denominator += weightedB;
    }
    return denominator === 0 ? null : numerator.divideScalar(denominator);
}

export { rationalbspline };
