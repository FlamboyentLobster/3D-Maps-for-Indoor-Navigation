import '../style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import scene from './Scene';
import camera from './Camera';
import renderer from './Renderer';
import walls from './Walls';
import floors from './Floors';
//import stairs from './Stairs';

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 20, 30, 60 ); //default; light shining from top
light.castShadow = true; // default false

const gridHelper = new THREE.GridHelper(100, 100);
scene.add(floors);
scene.add(walls, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 15;
controls.maxDistance = 70;

function animate() {
 requestAnimationFrame(animate);
 controls.update();
 renderer.render(scene, camera);
}

animate()
