import * as THREE from 'three';

var currentFloor = 0;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(20);
camera.position.setY(10);

export default camera
