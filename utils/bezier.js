import { Vector3 } from 'three';
import { bernstein } from './bernstein.js';

/**
 *
 * @param {Vector3[]} points
 * @param {number} t
 * @returns {Vector3} The point on the curve
 */
function bezier(points, t) {
    if (!points || !Array.isArray(points) || points.length < 2) {
        console.error('bezier: Invalid points array!');
        return null;
    }
    if (t < 0 || t > 1) {
        console.error('bezier: Invalid t value!');
        return null;
    }
    const n = points.length - 1;
    let result = new Vector3(0, 0, 0);
    for (let i = 0; i <= n; i++) {
        const b = bernstein(n, i, t);
        result.addScaledVector(points[i], b);
    }
    return result;
}

export { bezier };
