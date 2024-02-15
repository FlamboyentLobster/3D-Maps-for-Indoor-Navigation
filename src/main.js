import '../style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import scene from './Scene';
import camera from './Camera';
import renderer from './Renderer';
import floors from './Floors';
import objects from './Objects';
THREE.Cache.enabled = true;

var wallCount = 0;
var loader = new THREE.FileLoader();
loader.load( "src/3DBuilding.txt", function( text ) {
 
    if (text.length != 0) {
        const array = text.split(",")
        for (let x = 0; x < array.length - 1; x++) {
            switch (array[x]) {
                case "wall":
                    const wallTex = new THREE.TextureLoader().load('../textures/wall.png');
                    const geo = new THREE.BoxGeometry(0.1, 1, 1, 5);
                    const mat = new THREE.MeshBasicMaterial({map: wallTex, color: 0xFFF8E7, side: THREE.DoubleSide});
                    const wall = new THREE.Mesh(geo, mat);
                  
                    const wallClone = wall.clone();
                    scene.add(wallClone);
                    
                    wallClone.position.x = Number(array[x - 6]);
                    wallClone.position.y = Number(array[x - 5]);
                    wallClone.position.z = Number(array[x - 4]);
                    wallClone.rotation.y = Number(array[x - 3]);
                    wallClone.scale.y = Number(array[x - 2]);
                    wallClone.scale.z = Number(array[x - 1]);
                    wallClone.name = array[x] + array[x + 1];
                    wallClone.updateMatrix();
                    objects.push(wallClone);
                break;
                case "entrance":
                    const entranceTex = new THREE.TextureLoader().load('../textures/door.png');
                    const entrancegeo = new THREE.BoxGeometry(0.1, 1, 1, 5);
                    const entrancemat = new THREE.MeshBasicMaterial({map: entranceTex, color: 0xFFF8E7, side: THREE.DoubleSide});
                    const entrance = new THREE.Mesh(entrancegeo, entrancemat);
    
                    const entranceClone = entrance.clone();
                    scene.add(entranceClone);
    
                    entranceClone.position.x = Number(array[x - 6]);
                    entranceClone.position.y = Number(array[x - 5]);
                    entranceClone.position.z = Number(array[x - 4]);
                    entranceClone.rotation.y = Number(array[x - 3]);
                    entranceClone.scale.y = Number(array[x - 2]);
                    entranceClone.scale.z = Number(array[x - 1]);
                    entranceClone.name = array[x] + array[x + 1];
                    entranceClone.updateMatrix();
                    objects.push(entranceClone);
                break;
                case "stairs":

                break;          
            }
        }
    }
  
} );

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(floors);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
controls.maxDistance = 60;


var raiseButton = document.querySelector('.upButton');
var lowerButton = document.querySelector('.downButton');
var editButton = document.querySelector('.editButton');
var switchBox = document.querySelector('.switch');
raiseButton.disabled = true;
lowerButton.disabled = true;

var toggled = false;
		
raiseButton.addEventListener('click', function() {

})

lowerButton.addEventListener('click', function() {

})

editButton.addEventListener('click', function() {
    window.location.href ='edit.html';
})

switchBox.addEventListener('change', function() {
  if (toggled == false) {
    raiseButton.disabled = false;
    lowerButton.disabled = false;
    toggled = true;
  } 
  else {
    toggled = false;
  }
})

function animate() {
 requestAnimationFrame(animate);
 controls.update();
 renderer.render(scene, camera);
}

animate()
