import '../edit.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import scene from './Scene';
import camera from './Camera';
import renderer from './Renderer';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

let tempwallPos = [1000][7];
var wallNo = 0;
const currentWall = 0;
var currentFloor = 1;
var number = 1;

const objects = [];

const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
controls.maxDistance = 60;

var editButton = document.querySelector('.editButton');
var saveButton = document.querySelector('.saveButton');
var wallButton = document.querySelector('.wallButton');
var plusButton = document.querySelector('.plusButton');
var minusButton = document.querySelector('.minusButton');

editButton.addEventListener('click', function() {
    window.location.href ='index.html';
})

wallButton.addEventListener('click', function() {
const wallTex = new THREE.TextureLoader().load('../textures/wall.png');
const geo = new THREE.BoxGeometry(0.1, 1, 1, 5);
const mat = new THREE.MeshBasicMaterial({map: wallTex, color: 0xFFF8E7, side: THREE.DoubleSide});
const wall = new THREE.Mesh(geo, mat);

const wallClone = wall.clone();
scene.add(wallClone);

wallClone.scale.y = 2;
wallClone.position.y = 1;
wallClone.updateMatrix();
objects.push(wallClone);
})

plusButton.addEventListener('click', function() {
    
})

minusButton.addEventListener('click', function() {
   
})

saveButton.addEventListener('click', function() {
   
})

window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove, false);

/*
function hoverObjects() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(scene.children, true);
    for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.material.transparent = true;
        intersects[i].object.material.opacity = 0.5;
    }
}
*/
function animate() {
 requestAnimationFrame(animate);
 controls.update();
 //hoverObjects();
 renderer.render(scene, camera);
}

animate()

