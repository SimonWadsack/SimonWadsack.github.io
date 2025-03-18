import * as THREE from 'three';

const binomialCoefficientCache = {};
function binomialCoefficient(n, k) {
    if (k === 0 || k === n)
        return 1;
    if (binomialCoefficientCache[n] && binomialCoefficientCache[n][k]) {
        return binomialCoefficientCache[n][k];
    }
    var result = 1;
    for (var i = 1; i <= k; i++) {
        result *= (n - i + 1) / i;
    }
    if (!binomialCoefficientCache[n]) {
        binomialCoefficientCache[n] = {};
    }
    binomialCoefficientCache[n][k] = result;
    return result;
}
function lerp3D(a, b, t) {
    return new THREE.Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
}
function lerp3DMesh(a, b, t) {
    return lerp3D(a.position, b.position, t);
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}

export { binomialCoefficient, lerp, lerp3D, lerp3DMesh };
