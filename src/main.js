import '../style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import scene from './Scene';
import camera from './Camera';
import renderer from './Renderer';
import walls from './Walls';
import floors from './Floors';
//import stairs from './Stairs';

const CSSRenderer = new CSS2DRenderer();
CSSRenderer.setSize(window.innerWidth,window.innerHeight);
CSSRenderer.domElement.style.position = 'absolute';
CSSRenderer.domElement.style.top = '0px';
CSSRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(CSSRenderer.domElement);

const upButton = document.createElement('button');
upButton.type = 'button';
upButton.addEventListener('click', function(){
    
    // scene.remove(measurementLabels[close_button.id]);
});
//const label = new CSS2DObject(point);
//scene.add(label);

const div = document.createElement('div');
//div.appendChild(upButton);
const divContainer = new CSS2DObject(div);
scene.add(divContainer);

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 20, 30, 60 ); //default; light shining from top
light.castShadow = true; // default false

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(floors);
scene.add(walls, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
controls.maxDistance = 60;

function animate() {
 requestAnimationFrame(animate);
 controls.update();
 CSSRenderer.render(scene, camera);
 renderer.render(scene, camera);
}

animate()
