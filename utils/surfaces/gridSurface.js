import * as THREE from 'three';

function createGridGeometry(points, width, height) {
    if (points.length !== width * height) {
        console.error("Invalid points array length:", points.length, "Expected:", width * height, width, height);
        throw new Error("Points array length must match width * height");
    }
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    // Convert Vector3 points to a flat array
    for (const point of points) {
        vertices.push(point.x, point.y, point.z);
    }
    // Generate indices for the triangles
    for (let row = 0; row < height - 1; row++) {
        for (let col = 0; col < width - 1; col++) {
            const topLeft = row * width + col;
            const topRight = topLeft + 1;
            const bottomLeft = topLeft + width;
            const bottomRight = bottomLeft + 1;
            // First triangle (top-left, bottom-left, top-right)
            indices.push(topLeft, bottomLeft, topRight);
            // Second triangle (top-right, bottom-left, bottom-right)
            indices.push(topRight, bottomLeft, bottomRight);
        }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
}

export { createGridGeometry };
