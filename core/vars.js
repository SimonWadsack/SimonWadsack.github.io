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

export { getBackgroundColor, getColorFromPalette, getEditHandleColor, getHighlightColor, getOrthographicCameraPosition, getPerspectiveCameraPosition, getSelectedColor };
