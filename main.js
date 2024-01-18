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

const gridHelper = new THREE.GridHelper(70, 70);

var floors = 3;
var wallInstances = 8;

let wallPos = [
    [10, 2.5, 0, 0, 1, 1, 2], 
    [0, 2.5, 10, Math.PI / 2, 1, 1, 1],
    [-10, 2.5, 0, 0, 1, 1, 1],
    [0, 2.5, -10, Math.PI / 2, 1, 1, 1],
    [10, 10, 0, 0, 1, 1, 1], 
    [0, 10, 10, Math.PI / 2, 1, 1, 1],
    [-10, 10, 0, 0, 1, 1, 1],
    [0, 10, -10, Math.PI / 2, 1, 1, 1]
    ];

const tempWall = new THREE.Object3D();

const geometry = new THREE.BoxGeometry(0, 5, 5, 10);
const material = new THREE.MeshBasicMaterial({ color: 0xADD8E6 });
const wall = new THREE.InstancedMesh(geometry, material, wallInstances);

const geo = new THREE.WireframeGeometry( geometry ); // or WireframeGeometry
const mat = new THREE.LineBasicMaterial( { color: 0x000000 } );
const wireframe = new THREE.LineSegments( geo, mat, wallInstances );
wall.add(wireframe);

scene.add(wall, gridHelper);

for (let i = 0; i < wallInstances; i++) {
  tempWall.position.x = wallPos[i][0];
  tempWall.position.y = wallPos[i][1];
  tempWall.position.z = wallPos[i][2];
  tempWall.rotation.y = wallPos[i][3];
  tempWall.scale.x = wallPos[i][4];
  tempWall.scale.y = wallPos[i][5];
  tempWall.scale.z = wallPos[i][6];

  tempWall.updateMatrix();
  wall.setMatrixAt(i, tempWall.matrix)
  //wireframe.setMatrixAt(i, tempWall.matrix)
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 15;
controls.maxDistance = 70;

function animate() {
 requestAnimationFrame(animate);
 controls.update();
 renderer.render(scene, camera);
}

animate()
