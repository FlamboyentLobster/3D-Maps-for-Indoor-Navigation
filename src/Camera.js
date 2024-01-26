import * as THREE from 'three';

var currentFloor = 0;
var cameraPosition = 30;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(cameraPosition);

export default camera



function lowerFloor() {
    cameraPosition = cameraPosition - 10;
}