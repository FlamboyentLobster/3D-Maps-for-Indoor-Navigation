import * as THREE from 'three';

let floorPos = [
  [12.5, 9.5, 0, 0, 0],
  [12.5, 9.5, 0, 5, 0],
];

var floorNo = 2;

const tempFloor = new THREE.Object3D();
const floorTexture = new THREE.TextureLoader().load('../textures/wall.png');

const geometry = new THREE.BoxGeometry(1, 0.1, 1, 5);
const material = new THREE.MeshBasicMaterial({color: 0xFFF8E7, transparent: true, opacity: 0.7});
const floors = new THREE.InstancedMesh(geometry, material, floorNo);

for (let i = 0; i < floorNo; i++) {
  tempFloor.scale.x = floorPos[i][0];
  tempFloor.scale.z = floorPos[i][1];
  tempFloor.position.x = floorPos[i][2];
  tempFloor.position.y = floorPos[i][3];
  tempFloor.position.z = floorPos[i][4];

  tempFloor.updateMatrix();
  floors.setMatrixAt(i, tempFloor.matrix)
}

export default floors