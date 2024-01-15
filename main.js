import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xFFF8E7);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
canvas: document.querySelector('#bg'),
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 20, 30, 60 ); //default; light shining from top
light.castShadow = true; // default false

const geometry = new THREE.BoxGeometry(0, 5, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0xADD8E6, transparent: true});
const wall = new THREE.Mesh(geometry, material);
wall.receiveShadow = true;

const edges = new THREE.EdgesGeometry(geometry); 
const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000071 } ) ); 

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 15;
controls.maxDistance = 70;

const gridHelper = new THREE.GridHelper(70, 70);

scene.add(wall, gridHelper);
wall.position.set(0, 2.5, 0);

function animate() {
 requestAnimationFrame(animate);
 controls.update();
 renderer.render(scene, camera);
}

animate()


