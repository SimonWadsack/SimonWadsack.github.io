import { binomialCoefficient } from './math.js';

function bernstein(n, i, t) {
    if (n < 0 || i < 0 || i > n) {
        console.log('berstein: Invalid arguments for n or i: ', n, i);
    }
    if (t < 0 || t > 1) {
        console.log('berstein: Invalid arguments for t: ', t);
    }
    return binomialCoefficient(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}

export { bernstein };
