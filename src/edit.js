import '../edit.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import scene from './Scene';
import camera from './Camera';
import renderer from './Renderer';
import floors from './Floors';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var intersects = new THREE.Vector3();
var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

var toggle = false;

// walls = xValue, yValue, zValue, rotation, thickness, length, name 

var tempwallPos =  [[],[],[],[],[],[]];
var tempentrancePos = [[],[]];
var tempfloorsPos = [[],[]];
var wallNo = 0;
var currentWall = -1;
var currentObject = new THREE.Object3D;
var floorNo = 0;

function loadWalls() {

    
}

function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)
    raycaster.ray.intersectPlane(plane, intersects)

    if (toggle == true) {
        currentObject.position.set(intersects.x, intersects.y + 1, intersects.z)
    }  
}

function onMouseClick( event ) {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objects, false)
    if (intersects.length > 0) {
        if (toggle == false) {
            currentObject = scene.getObjectByName(intersects[0].object.name)
            toggle = true
        } else {
            toggle = false
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);

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
window.alert(tempwallPos.length)
currentWall += 1;
const wallTex = new THREE.TextureLoader().load('../textures/wall.png');
const geo = new THREE.BoxGeometry(0.1, 1, 1, 5);
const mat = new THREE.MeshBasicMaterial({map: wallTex, color: 0xFFF8E7, side: THREE.DoubleSide});
const wall = new THREE.Mesh(geo, mat);

const wallClone = wall.clone();
scene.add(wallClone);

wallClone.scale.y = 2;
wallClone.position.y = 1;
wallClone.name = 'wall' + currentWall;
wallClone.updateMatrix();
objects.push(wallClone);
})

plusButton.addEventListener('click', function() {
    
})

minusButton.addEventListener('click', function() {
   
})

saveButton.addEventListener('click', function() {
   
})

function animate() {
 controls.update();
 renderer.render(scene, camera);
 requestAnimationFrame(animate);
}

animate()