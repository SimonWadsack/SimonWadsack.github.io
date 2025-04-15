/**
 * This shader is used to render a bezier patch using control points stored in a texture.
 *
 * Uniforms:
 * @param {sampler2D} controlPointsTexture - The texture containing the control points.
 * @param {int} controlPointsWidth - The width of the control points texture.
 * @param {int} controlPointsHeight - The height of the control points texture.
 * @param {vec3} color - The color of the bezier patch.
 *  */
function bezierPatchVertexShader() {
    return /*glsl*/ `
    uniform sampler2D controlPointsTexture;
    uniform int controlPointsWidth;
    uniform int controlPointsHeight;
    uniform vec3 color;

    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUV;

    float binomial(int n, int k){
        if(k > n) return 0.0;
        if(k == 0 || k == n) return 1.0;
        float res = 1.0;
        for(int i = 0; i < k; i++){
            res *= float(n - i) / float(i + 1);
        }
        return res;
    }

    float bernstein(int n, int i, float t){
        return binomial(n, i) * pow(t, float(i)) * pow(1.0 - t, float(n - i));
    }

    // Derivative of the Bernstein polynomial with respect to t
    float bernsteinDerivative(int n, int i, float t) {
        if (i == 0) return -float(n) * bernstein(n - 1, i, t);
        if (i == n) return float(n) * bernstein(n - 1, i - 1, t);
        return float(n) * (bernstein(n - 1, i - 1, t) - bernstein(n - 1, i, t));
    }

    vec3 getControlPoint(int i, int j){
        vec2 texCoord = vec2(float(i) / float(controlPointsWidth - 1), float(j) / float(controlPointsHeight - 1));
        return texture2D(controlPointsTexture, texCoord).xyz;
    }

    void main(){
        vec2 uvClamped = clamp(uv, 0.0001, 0.9999);
        float u = uvClamped.x;
        float v = uvClamped.y;

        vec3 bezierPoint = vec3(0.0);
        vec3 tangentU = vec3(0.0);
        vec3 tangentV = vec3(0.0);

        for(int i = 0; i < controlPointsWidth; i++){
            float bernsteinU = bernstein(controlPointsWidth - 1, i, u);
            float bernsteinUDerivative = bernsteinDerivative(controlPointsWidth - 1, i, u);
            for(int j = 0; j < controlPointsHeight; j++){
                vec3 controlPoint = getControlPoint(i, j);
                float bernsteinV = bernstein(controlPointsHeight - 1, j, v);
                float bernsteinVDerivative = bernsteinDerivative(controlPointsHeight - 1, j, v);
                bezierPoint += controlPoint * bernsteinU * bernsteinV;
                tangentU += controlPoint * bernsteinUDerivative * bernsteinV;
                tangentV += controlPoint * bernsteinU * bernsteinVDerivative;
            }
        }

        vColor = color;
        vNormal = normalize(cross(tangentU, tangentV));
        vPosition = (modelMatrix * vec4(bezierPoint, 1.0)).xyz;
        vUV = uvClamped;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(bezierPoint, 1.0);
    }
`;
}

export { bezierPatchVertexShader };
