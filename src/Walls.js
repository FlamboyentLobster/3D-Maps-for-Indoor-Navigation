import * as THREE from 'three';
//const { wallPos } = require('./edit.js');

var wallInstances = 28; 

// [x, heightFromGround, z, rotation, scaleX, scaleY, lengthZ]

let wallPos = [
    [6.25, 1, 0, 0, 2, 9.5], 
    [1, 1, 4.75, Math.PI / 2, 2, 10.5],
    [-6.25, 1, -1, 0, 2, 7.5],
    [0, 1, -4.75, Math.PI / 2, 2, 12.5],
    [-5.25, 1, 3.75, Math.PI / 4, 2, 2.83],
    [-1.25, 1, 2.75, 0, 2, 4],
    [0.25, 1, 2.75, 0, 2, 4],
    [3.25, 1, 2, 0, 2, 5.5],
    [2.25, 1, -2.75, 0, 2, 4],
    [0.75, 1, -2.75, 0, 2, 4],
    [-0.75, 1, -2.75, 0, 2, 4],
    [-2.25, 1, -2, 0, 2, 5.5],
    [1.75, 1, 0.75, Math.PI / 2, 2, 3],
    [-3.75, 1, 0.75, Math.PI / 2, 2, 5],
    [-1.5, 1, -0.75, Math.PI / 2, 2, 1.5],
    [2, 1, -0.75, Math.PI / 2, 2, 2.5],
    [6.25, 6, 0, 0, 2, 9.5], 
    [1, 6, 4.75, Math.PI / 2, 2, 10.5],
    [-6.25, 6, -1, 0, 2, 7.5],
    [0, 6, -4.75, Math.PI / 2, 2, 12.5],
    [-5.25, 6, 3.75, Math.PI / 4, 2, 2.83],
    [0.75, 6, -2.75, 0, 2, 4],
    [-0.75, 6, -2.75, 0, 2, 4],
    [-3.5, 6, -0.75, Math.PI / 2, 2, 5.5],
    [3.5, 6, -0.75, Math.PI / 2, 2, 5.5],
    [0.75, 6, 0, 0, 2, 1.5],
    [-0.75, 6, 2, 0, 2, 5.5],
    [0, 6, 0.75, Math.PI / 2, 2, 1.5],
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
    tempWall.scale.y = wallPos[i][4];
    tempWall.scale.z = wallPos[i][5];
  
    tempWall.updateMatrix();
    walls.setMatrixAt(i, tempWall.matrix)
}

export default walls