import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { getBackgroundColor, getPerspectiveCameraPosition, getOrthographicCameraPosition } from './vars.js';
import { App } from './app.js';

/**
 *
 * @param container The container element
 * @returns The scene, camera, renderer and controls
 * @description Initializes the scene, camera, renderer and controls
 */
function initScene(container) {
    //create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(getBackgroundColor());
    //create the cameras
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(...getPerspectiveCameraPosition());
    const orthoSize = 100;
    const orthographicCamera = new THREE.OrthographicCamera(container.clientWidth / -100, container.clientWidth / orthoSize, container.clientHeight / orthoSize, container.clientHeight / -100, 0.1, 1000);
    orthographicCamera.position.set(...getOrthographicCameraPosition());
    //create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    //create the controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    //create the ambient light
    const light = new THREE.AmbientLight(0xf0f0f0, 1);
    scene.add(light);
    //create the directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 4.5);
    dirLight.position.set(0, 25, 0);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    scene.add(dirLight);
    window.addEventListener('resize', () => resize(container, camera, renderer));
    App.setupScene(scene, camera, orthographicCamera, renderer, controls);
}
/**
 * @param {Scene} scene The Three.js scene
 * @returns The grid and the shadow plane
 * @description Initializes the grid and the shadow plane
 */
function initGrid() {
    //create the grid
    const grid = new THREE.GridHelper(20, 40);
    grid.material.opacity = 0.75;
    grid.material.transparent = true;
    grid.position.set(0, -0.5, 0);
    //create the shadow plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.position.set(0, -0.51, 0);
    App.getScene().add(grid);
    App.getScene().add(plane);
    App.setupGrid(grid, plane);
}
function initTooltip(container) {
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'var(--sl-color-neutral-100)';
    tooltip.style.color = 'var(--sl-input-color)';
    tooltip.style.fontFamily = 'var(--sl-font-sans)';
    tooltip.style.fontSize = 'var(--sl-font-size-small)';
    tooltip.style.padding = '0.5em';
    tooltip.style.borderRadius = 'var(--sl-border-radius-small)';
    tooltip.style.border = 'solid';
    tooltip.style.borderWidth = '1px';
    tooltip.style.borderColor = 'var(--sl-color-neutral-300)';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = '1000';
    //tooltip.style.minWidth = '100px';
    //tooltip.style.minHeight = '200px';
    tooltip.innerText = "TEST";
    container.appendChild(tooltip);
    App.setTooltip(tooltip);
}
function resize(container, camera, renderer) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

export { initGrid, initScene, initTooltip };
