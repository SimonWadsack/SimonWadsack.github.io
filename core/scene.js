import * as THREE from 'three';
import { OrbitControls, TransformControls } from 'three/examples/jsm/Addons.js';
import { getPerspectiveCameraPosition, getOrthographicCameraPosition } from './vars.js';
import { App } from './app.js';
import { EventBus } from './events.js';

/**
 *
 * @param container The container element
 * @returns The scene, camera, renderer and controls
 * @description Initializes the scene, camera, renderer and controls
 */
function initScene(container) {
    //create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0000ff);
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
    const oControls = new OrbitControls(orthographicCamera, renderer.domElement);
    oControls.enableDamping = true;
    oControls.dampingFactor = 0.25;
    oControls.enableRotate = false;
    oControls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    };
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.setTranslationSnap(0.01);
    transformControls.addEventListener('objectChange', () => EventBus.notify('transformMoved', "viewport" /* EEnv.VIEWPORT */));
    const oTransformControls = new TransformControls(orthographicCamera, renderer.domElement);
    oTransformControls.setTranslationSnap(0.01);
    oTransformControls.addEventListener('objectChange', () => EventBus.notify('transformMoved', "viewport" /* EEnv.VIEWPORT */));
    oTransformControls.showY = false;
    //create the ambient light
    const light = new THREE.AmbientLight(0xf0f0f0, 0.2);
    scene.add(light);
    //create the directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(15, 20, 0);
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
    //scene.add(new THREE.DirectionalLightHelper(dirLight, 5, 0x000000));
    window.addEventListener('resize', () => resize(container, camera, orthographicCamera, orthoSize, renderer));
    window.addEventListener('keyup', (e) => { if (e.key === 'd') {
        App.switchDimension();
    } });
    window.addEventListener('beforeunload', () => App.getIOManager().saveSceneToCache());
    App.setupScene(scene, camera, orthographicCamera, renderer, controls, oControls, transformControls, oTransformControls, light, dirLight);
    //add logo
    const logoDiv = document.createElement('div');
    logoDiv.style.position = 'absolute';
    logoDiv.style.bottom = '1rem';
    logoDiv.style.right = '23%';
    logoDiv.style.display = 'flex';
    logoDiv.style.flexDirection = 'column';
    logoDiv.style.alignItems = 'center';
    logoDiv.style.gap = '0.5rem';
    const logoETH = document.createElement('img');
    logoETH.src = '/icons/eth.svg';
    logoETH.style.width = '5rem';
    logoETH.style.opacity = '0.6';
    logoETH.style.cursor = 'pointer';
    logoETH.onclick = () => window.open('https://inf.ethz.ch/', '_blank');
    logoDiv.appendChild(logoETH);
    const logoCGL = document.createElement('img');
    logoCGL.src = '/icons/cgl.svg';
    logoCGL.style.width = '8rem';
    logoCGL.style.cursor = 'pointer';
    logoCGL.onclick = () => window.open('https://www.cgl.ethz.ch/', '_blank');
    logoDiv.appendChild(logoCGL);
    const madeBy = document.createElement('p');
    madeBy.innerText = 'Made by Simon Wadsack';
    madeBy.style.fontSize = '0.7rem';
    madeBy.style.color = 'var(--sl-color-neutral-400)';
    madeBy.style.cursor = 'pointer';
    madeBy.onclick = () => window.open('https://github.com/SimonWadsack/', '_blank');
    logoDiv.appendChild(madeBy);
    container.appendChild(logoDiv);
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
function setupMode() {
    const darkMode = App.getIOManager().getFlagCache('darkMode');
    App.setMode(darkMode);
}
function resize(container, camera, oCamera, orthoSize, renderer) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    oCamera.left = container.clientWidth / -100;
    oCamera.right = container.clientWidth / orthoSize;
    oCamera.top = container.clientHeight / orthoSize;
    oCamera.bottom = container.clientHeight / -100;
    oCamera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

export { initGrid, initScene, initTooltip, setupMode };
