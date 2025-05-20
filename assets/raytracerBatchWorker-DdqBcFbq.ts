import { RaytraceObject } from "./raytraceObject";
import { Raytracer } from "./raytracer";
import { RaytracerTask } from "./raytracerTask";
import * as THREE from 'three';
import { RaytracerBatchTask, RaytracerBatchWorkerMessage } from "./raytracerWorker";

self.onmessage = async (event: MessageEvent<RaytracerBatchTask>) => {
    const batch = event.data;
    const task = batch.task;
    const ambientLight = task.ambientLight;
    const directionalLight = task.directionalLight;
    const camera = task.camera;

    const raytraceCamera = new THREE.PerspectiveCamera(camera.fov, task.width / task.height, 0.1, 1000);
    raytraceCamera.position.copy(camera.position);
    raytraceCamera.rotation.copy(camera.rotation);
    raytraceCamera.up.copy(camera.up);
    raytraceCamera.updateProjectionMatrix();
    raytraceCamera.updateMatrixWorld();

    ambientLight.color = new THREE.Color(ambientLight.color.r, ambientLight.color.g, ambientLight.color.b);

    directionalLight.direction = new THREE.Vector3(directionalLight.direction.x, directionalLight.direction.y, directionalLight.direction.z).normalize();
    directionalLight.color = new THREE.Color(directionalLight.color.r, directionalLight.color.g, directionalLight.color.b);

    const data = new Uint8ClampedArray(batch.width * batch.height * 4);

    const origin = raytraceCamera.position.clone();

    for (let x = batch.xStart; x < batch.xStart + batch.width; x++) {
        for (let y = batch.yStart; y < batch.yStart + batch.height; y++){

            const localX = x - batch.xStart;
            const localY = y - batch.yStart;
            const accumulatedColor = new THREE.Color(0, 0, 0);

            for (const offset of batch.suppixelOffsets){
                const ndcX = ((x + offset.dx) / task.width) * 2 - 1;
                const ndcY = 1 - ((y + offset.dy) / task.height) * 2;

                const ray = new THREE.Raycaster();
                ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), raytraceCamera);

                const direction = ray.ray.direction.clone().normalize();

                const color = Raytracer.raytrace(origin, direction, task.bounces, task.skybox, task.objects, ambientLight, directionalLight, task.quality);
                
                accumulatedColor.add(color);
            }

            accumulatedColor.multiplyScalar(1 / (batch.supersamplingFactor * batch.supersamplingFactor));

            Raytracer.setPixel(data, batch.width, localX, localY, accumulatedColor);
        }
    }

    const message: RaytracerBatchWorkerMessage = {
        workerId: batch.workerId,
        progress: 100,
        data: data,
        xStart: batch.xStart,
        yStart: batch.yStart,
        width: batch.width,
        height: batch.height,
        startTime: task.startTime,
        task: task,
    };

    self.postMessage(message);

}

export {};