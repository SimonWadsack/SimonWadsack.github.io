import { App } from '../../core/app.js';
import * as THREE from 'three';
import { RaytraceSphere, RaytraceObjectType } from './raytraceObject.js';
import { RaytracerDialog } from './raytracerDialog.js';

class Raytracer {
    static dialog = null;
    static prepareTask(width, height, bounces, skybox) {
        const camera = App.getPerspectiveCamera();
        if (camera === null)
            throw new Error('Trying to raytrace in 2D mode!');
        const lightPos = App.getDirectionalLight().position.clone();
        const lightDirection = lightPos.normalize();
        //TEMP: const objects: RaytraceObject[] = [new RaytraceSphere(new THREE.Vector3(0, 0, 0), 1, new THREE.Color(0, 1, 0)),
        // new RaytraceSphere(new THREE.Vector3(2, 0, 2), 1.5, new THREE.Color(0, 0, 1)),
        // new RaytraceSphere(new THREE.Vector3(3, 3, -5), 3, new THREE.Color(1, 0, 0))];
        const objects = [new RaytraceSphere(new THREE.Vector3(0, 0, 0), 1, new THREE.Color(1, 1, 1))];
        return {
            width: width,
            height: height,
            bounces: bounces,
            skybox: skybox,
            objects: objects,
            ambientLight: {
                color: App.getAmbientLight().color.clone(),
                intensity: App.getAmbientLight().intensity,
            },
            directionalLight: {
                direction: lightDirection,
                color: App.getDirectionalLight().color.clone(),
                intensity: App.getDirectionalLight().intensity,
            },
            camera: {
                position: camera.position.clone(),
                rotation: camera.rotation.clone(),
                fov: camera.fov,
                up: camera.up.clone(),
            }
        };
    }
    static execute(task) {
        if (!this.dialog)
            this.dialog = new RaytracerDialog();
        this.dialog.show();
        const worker = new Worker(new URL(/* @vite-ignore */ "/assets/raytracerWorker---hXNUpj.js", import.meta.url), { type: 'module' });
        worker.onmessage = this.onMessage.bind(this);
        worker.postMessage(task);
    }
    static onMessage(event) {
        this.downloadImage(event.data.data, event.data.width, event.data.height);
        this.dialog?.hide();
    }
    //#region Raytracing functions
    static raytrace(origin, direction, bounces, skybox, objects, ambLight, dirLight) {
        const color = new THREE.Color(0, 0, 0);
        var minDistance = Number.MAX_VALUE;
        for (const object of objects) {
            if (object.type === RaytraceObjectType.SPHERE) {
                const sphere = object;
                const result = this.raytraceSphere(sphere, origin, direction, ambLight, dirLight);
                if (result.hit && result.distance < minDistance) {
                    minDistance = result.distance;
                    color.copy(result.color);
                }
            }
        }
        if (minDistance === Number.MAX_VALUE) {
            return skybox ? this.raytraceSkybox(direction, new THREE.Color(0.5, 0.7, 1)) : new THREE.Color(0, 0, 0);
        }
        else {
            return color; // Return the color of the nearest object
        }
    }
    static raytraceSphere(sphere, origin, direction, ambLight, dirLight) {
        const oc = origin.clone().sub(sphere.center);
        const a = direction.dot(direction);
        const b = 2.0 * oc.dot(direction);
        const c = oc.dot(oc) - sphere.radius * sphere.radius;
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            return { color: new THREE.Color(0, 0, 0), hit: false, distance: 0 }; // No intersection
        }
        else {
            // Calculate the intersection point (only the nearest one)
            const t = (-b - Math.sqrt(discriminant)) / (2.0 * a);
            const intersection = origin.clone().add(direction.clone().multiplyScalar(t));
            // Calculate the surface normal at the intersection point
            const normal = intersection.clone().sub(sphere.center).normalize();
            // Calculate the diffuse shading intensity
            const diffuseIntensity = Math.max(0, normal.dot(dirLight.direction.normalize())) * dirLight.intensity;
            // Scale the light color by the diffuse intensity
            const diffuseColor = dirLight.color.clone().multiplyScalar(diffuseIntensity);
            // Calculate the ambient light contribution
            const ambientColor = ambLight.color.clone().multiplyScalar(ambLight.intensity);
            // Combine ambient and diffuse lighting
            const lightingColor = ambientColor.add(diffuseColor);
            const sphereColor = new THREE.Color(sphere.color.r, sphere.color.g, sphere.color.b);
            const finalColor = sphereColor.multiply(lightingColor);
            return { color: finalColor, hit: true, distance: t }; // Return the color and hit information
        }
    }
    static raytraceSkybox(direction, skyColor) {
        const y = direction.y;
        const groundTop = new THREE.Color(0.5, 0.5, 0.5);
        const groundBottom = new THREE.Color(0.2, 0.2, 0.2);
        const skyTop = skyColor.clone().multiplyScalar(0.5);
        const skyBottom = skyColor.clone();
        const t = 0.5 * (y + 1.0);
        if (y > 0.0) {
            return skyBottom.clone().lerp(skyTop, t);
        }
        else {
            return groundBottom.clone().lerp(groundTop, t);
        }
    }
    //#endregion
    //#region Helper functions
    static setPixel(data, width, x, y, color) {
        const index = (y * width + x) * 4;
        data[index] = Math.floor(color.r * 255);
        data[index + 1] = Math.floor(color.g * 255);
        data[index + 2] = Math.floor(color.b * 255);
        data[index + 3] = 255;
    }
    static downloadImage(data, width, height) {
        const imageData = new ImageData(data, width, height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (context) {
            context.putImageData(imageData, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'raytrace.png';
            link.click();
        }
        else {
            throw new Error('Failed to get canvas context');
        }
    }
}

export { Raytracer };
