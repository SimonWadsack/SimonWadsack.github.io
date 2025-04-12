/**
 * This shader is used to render a bspline surface using control points stored in a texture.
 *
 * Uniforms:
 * @param {sampler2D} controlPointsTexture - The texture containing the control points.
 * @param {int} controlPointsWidth - The width of the control points texture.
 * @param {int} controlPointsHeight - The height of the control points texture.
 * @param {vec3} color - The color of the bspline surface.
 *  */
function bsplineSurfaceVertexShader() {
    return /*glsl*/ `
    uniform sampler2D controlPointsTexture;
    uniform int controlPointsWidth;
    uniform int controlPointsHeight;
    uniform vec3 color;
    uniform int degree;
    uniform bool closedU;
    uniform bool closedV;

    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;

    float delta = 0.0001;

    float getUniformKnotValue(int index){
        return float(index);
    }

    float basis(int p, int i, float t) {
        float B[10]; //max degree 10
        
        for (int j = 0; j <= p; j++) {
            if (t >= getUniformKnotValue(i + j) && t < getUniformKnotValue(i + j + 1))
                B[j] = 1.0;
            else
                B[j] = 0.0;
        }
    
        for (int k = 1; k <= p; k++) {
            for (int j = 0; j <= p - k; j++) {
                float left = 0.0;
                float right = 0.0;
    
                float denomLeft = getUniformKnotValue(i + j + k) - getUniformKnotValue(i + j);
                if (denomLeft > delta)
                    left = ((t - getUniformKnotValue(i + j)) / denomLeft) * B[j];
    
                float denomRight = getUniformKnotValue(i + j + k + 1) - getUniformKnotValue(i + j + 1);
                if (denomRight > delta)
                    right = ((getUniformKnotValue(i + j + k + 1) - t) / denomRight) * B[j + 1];
    
                B[j] = left + right;
            }
        }
    
        return B[0];
    }

    float basisDerivative(int p, int i, float t) {
        if(p == 0) return 0.0;

        float left = 0.0;
        float right = 0.0;

        float denomLeft = getUniformKnotValue(i + p) - getUniformKnotValue(i);
        if(denomLeft > delta)
            left = (float(p) / denomLeft) * basis(p - 1, i, t);

        float denomRight = getUniformKnotValue(i + p + 1) - getUniformKnotValue(i + 1);
        if(denomRight > delta)
            right = (float(p) / denomRight) * basis(p - 1, i + 1, t);

        return left - right;
    }

    vec3 getControlPoint(int i, int j){
        int modI = i % controlPointsWidth;
        int modJ = j % controlPointsHeight;
        vec2 texCoord = vec2(float(modI) / float(controlPointsWidth - 1), float(modJ) / float(controlPointsHeight - 1));
        return texture2D(controlPointsTexture, texCoord).xyz;
    }

    void main(){
        vec2 uvClamped = clamp(uv, 0.0, 1.0);
        float u = uvClamped.x;
        float v = uvClamped.y;

        vec3 basisPoint = vec3(0.0);
        vec3 tangentU = vec3(0.0);
        vec3 tangentV = vec3(0.0);

        int closedAddU = closedU ? degree : 0;
        int closedAddV = closedV ? degree : 0;

        int knotsULength = controlPointsWidth - 1 + degree + 2 + closedAddU;
        int knotsVLength = controlPointsHeight - 1 + degree + 2 + closedAddV;

        for(int i = 0; i < controlPointsWidth + closedAddU; i++){
            float modU = getUniformKnotValue(degree) + u * (getUniformKnotValue(knotsULength - degree - 1) - getUniformKnotValue(degree));
            float basisU = basis(degree, i, modU);
            float basisUDerivative = basisDerivative(degree, i, modU);
            for(int j = 0; j < controlPointsHeight + closedAddV; j++){
                vec3 controlPoint = getControlPoint(i, j);
                float modV = getUniformKnotValue(degree) + v * (getUniformKnotValue(knotsVLength - degree - 1) - getUniformKnotValue(degree));
                float basisV = basis(degree, j, modV);
                float basisVDerivative = basisDerivative(degree, j, modV);
                basisPoint += controlPoint * basisU * basisV;
                tangentU += controlPoint * basisUDerivative * basisV;
                tangentV += controlPoint * basisU * basisVDerivative;
            }
        }

        vColor = color;
        vNormal = normalize(cross(tangentU, tangentV));
        vPosition = (modelMatrix * vec4(basisPoint, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(basisPoint, 1.0);
    }
`;
}
function bsplineSurfaceFragmentShader() {
    return /*glsl*/ `
    uniform vec3 lightDirection;
    uniform vec3 lightColor;
    uniform float lightIntensity;
    uniform float ambientIntensity;
    uniform vec3 ambientColor;
    uniform float specularIntensity;  
    uniform float specularPower; 

    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main(){
        // Normalize the normal vector and compute the light direction
        vec3 norm = normalize(vNormal);

        vec3 lightDir = normalize(-lightDirection);

        // Ambient lighting
        vec3 ambient = ambientIntensity * ambientColor;

        // Diffuse lighting (Lambert's cosine law)
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = diff * lightColor * lightIntensity;

        // Specular lighting (Phong reflection model)
        vec3 viewDir = normalize(vPosition - cameraPosition);
        vec3 reflectDir = reflect(-lightDir, norm);   // Reflection direction
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
        vec3 specular = spec * specularIntensity * lightColor * lightIntensity;

        // Combine all lighting components
        vec3 finalColor = (ambient + diffuse + specular) * vColor;

        // Output the final color
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;
}

export { bsplineSurfaceFragmentShader, bsplineSurfaceVertexShader };
