const binomialCoefficientCache = {};

function binomialCoefficient(n, k) {
    if (k === 0 || k === n) return 1;

    if(binomialCoefficientCache[n] && binomialCoefficientCache[n][k]) {
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

export { binomialCoefficient };
