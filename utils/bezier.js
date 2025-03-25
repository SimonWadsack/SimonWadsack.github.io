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
function cubicBezier(p0, p1, p2, p3, t) {
    if (t < 0 || t > (1 + 0.05)) {
        console.error('cubicBezier: Invalid t value!', t);
        return null;
    }
    const u = 1 - t;
    const u2 = u * u;
    const u3 = u2 * u;
    const t2 = t * t;
    const t3 = t2 * t;
    const result = new Vector3(0, 0, 0);
    result.addScaledVector(p0, u3);
    result.addScaledVector(p1, 3 * u2 * t);
    result.addScaledVector(p2, 3 * u * t2);
    result.addScaledVector(p3, t3);
    return result;
}

export { bezier, cubicBezier };
