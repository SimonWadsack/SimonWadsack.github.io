import { Vector3 } from 'three';

function getPerspectiveCameraPosition() {
    return [-5, 10, 5];
}
function getOrthographicCameraPosition() {
    return [0, 100, 0];
}
//https://flatuicolors.com/palette/defo
function getBackgroundColor() {
    return 0xecf0f1;
}
function getHighlightColor() {
    return 0xe67e22;
}
function getSelectedColor() {
    return 0xe74c3c;
}
function getEditHandleColor() {
    return 0x34495e;
}
function getColorFromPalette(i) {
    const colors = [0x1abc9c, 0x2ecc71, 0x3498db, 0x9b59b6, 0x34495e, 0xf1c40f, 0xe67e22, 0xe74c3c];
    return colors[i % colors.length];
}
function getNewPosition(a, b) {
    var result = new Vector3();
    result.set(a.x + (a.x - b.x), a.y - (a.y - b.y), a.z + (a.z - b.z));
    return result;
}
//TODO - manager to register new objects including icons...
function getIcon(type) {
    switch (type) {
        case 'LinearCurveObject': return { name: 'waypoints', lucide: true };
        case 'BezierCurveObject': return { name: 'bezier2', lucide: false };
        case 'BezierSplineObject': return { name: 'bezier', lucide: false };
        case 'UniformBSplineObject': return { name: 'spline', lucide: true };
        case 'UniformRationBSplineObject': return { name: 'diameter', lucide: true };
        default: return { name: 'circle-help', lucide: true };
    }
}

export { getBackgroundColor, getColorFromPalette, getEditHandleColor, getHighlightColor, getIcon, getNewPosition, getOrthographicCameraPosition, getPerspectiveCameraPosition, getSelectedColor };
