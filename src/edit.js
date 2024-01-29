import '../edit.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import scene from './Scene';
import camera from './Camera';
import renderer from './Renderer';

const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
controls.maxDistance = 60;
var cameraHeight = 0;
var cameraPosition = 10;

var raiseButton = document.querySelector('.upButton');
var lowerButton = document.querySelector('.downButton');
var editButton = document.querySelector('.editButton');
var saveButton = document.querySelector('.saveButton');

raiseButton.addEventListener('click', function() {
    cameraHeight += 5
    cameraPosition += 5
    camera.position.setY(cameraPosition);
    controls.target.set(0, cameraHeight, 0);
    controls.update();
})

lowerButton.addEventListener('click', function() {
    cameraHeight -= 5
    cameraPosition -= 5
    camera.position.setY(cameraPosition);
    controls.target.set(0, cameraHeight, 0);
    controls.update();
})

editButton.addEventListener('click', function() {
    window.location.href ='index.html';
})

saveButton.addEventListener('click', function() {
   
})

function animate() {
 requestAnimationFrame(animate);
 controls.update();
 renderer.render(scene, camera);
}

animate()

