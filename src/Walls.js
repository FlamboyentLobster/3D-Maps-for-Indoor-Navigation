import * as THREE from 'three';

var wallInstances = 8;

let wallPos = [
    [10, 2.5, 0, 0, 1, 1, 2], 
    [0, 2.5, 10, Math.PI / 2, 1, 1, 1],
    [-10, 2.5, 0, 0, 1, 1, 1],
    [0, 2.5, -10, Math.PI / 2, 1, 1, 1],
    [10, 12.5, 0, 0, 1, 1, 1], 
    [0, 12.5, 10, Math.PI / 2, 1, 1, 1],
    [-10, 12.5, 0, 0, 1, 1, 1],
    [0, 12.5, -10, Math.PI / 2, 1, 1, 1]
];

const tempWall = new THREE.Object3D();

const wallTexture = new THREE.TextureLoader().load('../textures/wall.png');

const geometry = new THREE.BoxGeometry(0.2, 5, 5, 5);
const material = new THREE.MeshBasicMaterial({ map: wallTexture, color: 0xFFF8E7, side: THREE.DoubleSide});
const walls = new THREE.InstancedMesh(geometry, material, wallInstances);

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
    //wall.setColorAt(i, new THREE.Color(Math.random() * 0xAAAAAA))
    //wireframe.setMatrixAt(i, tempWall.matrix)
}

export default walls