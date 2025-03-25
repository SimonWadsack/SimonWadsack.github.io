import { Vector3 } from 'three';
import { basis } from './basis.js';

function bspline(points, t, p, knots) {
    if (!points || !Array.isArray(points) || points.length < 2) {
        console.error('bspline: Invalid points array!');
        return null;
    }
    if (t < knots[0] || t > knots[knots.length - 1]) {
        console.error('bspline: Invalid t value!');
        return null;
    }
    let n = points.length - 1;
    if (knots.length !== n + p + 2) {
        console.error('bspline: Invalid knots array!');
        return null;
    }
    let result = new Vector3(0, 0, 0);
    for (let i = 0; i <= n; i++) {
        const b = basis(p, i, t, knots);
        result.addScaledVector(points[i], b);
    }
    return result;
}

export { bspline };
