import '../style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import scene from './Scene';
import camera from './Camera';
import renderer from './Renderer';
//import walls from './Walls';
import floors from './Floors';
//import stairs from './Stairs';

var wallInstances = 28; 

let wallPos = [
    [6.25, 1, 0, 0, 1, 2, 9.5], 
    [1, 1, 4.75, Math.PI / 2, 1, 2, 10.5],
    [-6.25, 1, -1, 0, 1, 2, 7.5],
    [0, 1, -4.75, Math.PI / 2, 1, 2, 12.5],
    [-5.25, 1, 3.75, Math.PI / 4, 1, 2, 2.83],
    [-1.25, 1, 2.75, 0, 1, 2, 4],
    [0.25, 1, 2.75, 0, 1, 2, 4],
    [3.25, 1, 2, 0, 1, 2, 5.5],
    [2.25, 1, -2.75, 0, 1, 2, 4],
    [0.75, 1, -2.75, 0, 1, 2, 4],
    [-0.75, 1, -2.75, 0, 1, 2, 4],
    [-2.25, 1, -2, 0, 1, 2, 5.5],
    [1.75, 1, 0.75, Math.PI / 2, 1, 2, 3],
    [-3.75, 1, 0.75, Math.PI / 2, 1, 2, 5],
    [-1.5, 1, -0.75, Math.PI / 2, 1, 2, 1.5],
    [2, 1, -0.75, Math.PI / 2, 1, 2, 2.5],
    [6.25, 6, 0, 0, 1, 2, 9.5], 
    [1, 6, 4.75, Math.PI / 2, 1, 2, 10.5],
    [-6.25, 6, -1, 0, 1, 2, 7.5],
    [0, 6, -4.75, Math.PI / 2, 1, 2, 12.5],
    [-5.25, 6, 3.75, Math.PI / 4, 1, 2, 2.83],
    [0.75, 6, -2.75, 0, 1, 2, 4],
    [-0.75, 6, -2.75, 0, 1, 2, 4],
    [-3.5, 6, -0.75, Math.PI / 2, 1, 2, 5.5],
    [3.5, 6, -0.75, Math.PI / 2, 1, 2, 5.5],
    [0.75, 6, 0, 0, 1, 2, 1.5],
    [-0.75, 6, 2, 0, 1, 2, 5.5],
    [0, 6, 0.75, Math.PI / 2, 1, 2, 1.5],
];

const tempWall = new THREE.Object3D();

const wallTexture = new THREE.TextureLoader().load('../textures/wall.png');

const geometry = new THREE.BoxGeometry(0.1, 1, 1, 5);
const material = new THREE.MeshBasicMaterial({ map: wallTexture, color: 0xFFF8E7, side: THREE.DoubleSide});
const walls = new THREE.InstancedMesh(geometry, material, wallInstances);
walls.instanceMatrix.setUsage( THREE.DynamicDrawUsage );

for (let i = 0; i < wallInstances; i++) {
    tempWall.position.x = wallPos[i][0];
    tempWall.position.y = wallPos[i][1];
    tempWall.position.z = wallPos[i][2];
    tempWall.rotation.y = wallPos[i][3];
    tempWall.scale.x = wallPos[i][4];
    tempWall.scale.y = wallPos[i][5];
    tempWall.scale.z = wallPos[i][6];
  
    tempWall.updateMatrix();
    walls.setMatrixAt(i, tempWall.matrix)
}

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(floors);
scene.add(walls, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
controls.maxDistance = 60;
var cameraHeight = 0;
var cameraPosition = 10;

var raiseButton = document.querySelector('.upButton');
var lowerButton = document.querySelector('.downButton');
var editButton = document.querySelector('.editButton');
var extraButton = document.querySelector('.extraButton');

var gui = new GUI();
gui.add( walls, 'count', 5, wallInstances );
		
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
    window.location.href ='edit.html';
})

extraButton.addEventListener('click', function() {
    wallInstances = 12;
})

function animate() {
 requestAnimationFrame(animate);
 controls.update();
 renderer.render(scene, camera);
}

animate()

