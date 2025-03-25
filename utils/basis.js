function basis(p, i, t, knots) {
    if (t < knots[0] || t > knots[knots.length - 1]) {
        console.log('basis: Invalid arguments for t: ', t);
    }
    if (p === 0) {
        return (knots[i] <= t && t < knots[i + 1]) ? 1 : 0;
    }
    let leftDenom = knots[i + p] - knots[i];
    let rightDenom = knots[i + p + 1] - knots[i + 1];
    let left = leftDenom === 0 ? 0 : (t - knots[i]) / leftDenom * basis(p - 1, i, t, knots);
    let right = rightDenom === 0 ? 0 : (knots[i + p + 1] - t) / rightDenom * basis(p - 1, i + 1, t, knots);
    return left + right;
}
function uniformKnotVector(p, n) {
    let knots = [];
    for (let i = 0; i <= n + p + 1; i++) {
        knots.push(i);
    }
    return knots;
}

export { basis, uniformKnotVector };
