import '../style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import scene from './Scene';
import camera from './Camera';
import renderer from './Renderer';
import objects from './Objects';
THREE.Cache.enabled = true;

var entrances = [];
entrances[0] = 'default'
var rooms = [];
rooms[0] = 'default'
var o = 1;
var limito = 0;
var p = 1;
var limitp = 0;
var currentRoom = "";
var currentEntrance = "";
var textFile = [];

var loader = new THREE.FileLoader();
loader.load( "src/3DBuilding.txt", function( text ) {
    if (text.length != 0) {
        const array = text.split(",")
        textFile = array
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
                // nameid, x, y, z
                case "entranceNode":
                    entrances[o] = array[x] + array[x + 1];
                    o += 1
                break; 
                case "roomNode0":
                    rooms[p] = array[x] + array[x + 1];
                    p += 1
                break; 
            }
        }
        limito = o;
        limitp = p;
        o = 0;
        p = 0;
    }
  
} );

let graph = {
	entranceNode000: { hallwayNode000: 1.5 },
    entranceNode001: { hallwayNode009: 1.5 },
	hallwayNode000: { entranceNode000: 1.5, roomNode0007: 1.5, hallwayNode001: 2 },
    hallwayNode001: { hallwayNode000: 1.5, hallwayNode004: 3, hallwayNode006: 3 },
    hallwayNode002: { hallwayNode006: 2, hallwayNode003: 1, roomNode0008: 1.5 },
    hallwayNode003: { hallwayNode002: 1, roomNode0009: 1.5 },
    hallwayNode004: { hallwayNode001: 3, hallwayNode005: 2, roomNode0000: 1.5 },
    hallwayNode005: { hallwayNode004: 2, roomNode0005: 1.5, roomNode0006: 1 },
    hallwayNode006: { hallwayNode001: 1, hallwayNode002: 2, hallwayNode007: 2 },
    hallwayNode007: { hallwayNode006: 2, hallwayNode008: 3, hallwayNode010: 2 },
    hallwayNode008: { hallwayNode007: 3, hallwayNode009: 2, roomNode0001: 1.5 },
    hallwayNode009: { hallwayNode008: 2, roomNode0002: 1.5, entranceNode001: 1.5 },
    hallwayNode010: { hallwayNode007: 2, hallwayNode013: 2, hallwayNode011: 3 },
    hallwayNode011: { hallwayNode010: 3, hallwayNode012: 3, roomNode0003: 1.5 },
    hallwayNode012: { hallwayNode011: 3, roomNode0004: 1.5 },
    hallwayNode013: { hallwayNode010: 2 },
    roomNode0000: { hallwayNode004: 1.5 },
    roomNode0001: { hallwayNode008: 1  },
    roomNode0002: { hallwayNode009: 1.5 },
    roomNode0003: { hallwayNode011: 1.5 },
    roomNode0004: { hallwayNode012: 1.5 },
    roomNode0005: { hallwayNode005: 1.5  },
    roomNode0006: { hallwayNode005: 1  },
    roomNode0007: { hallwayNode000: 1.5  },
    roomNode0008: { hallwayNode002: 1.5 },
    roomNode0009: { hallwayNode003: 1.5  },
};

let shortestDistanceNode = (distances, visited) => {
    // create a default value for shortest
      let shortest = null;
      
        // for each node in the distances object
      for (let node in distances) {
          // if no node has been assigned to shortest yet
            // or if the current node's distance is smaller than the current shortest
          let currentIsShortest =
              shortest === null || distances[node] < distances[shortest];
              
            // and if the current node is in the unvisited set
          if (currentIsShortest && !visited.includes(node)) {
              // update shortest to be the current node
              shortest = node;
          }
      }
      return shortest;
  };

let findShortestPath = (graph, startNode, endNode) => {
 
    // track distances from the start node using a hash object
      let distances = {};
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);
   // track paths using a hash object
    let parents = { endNode: null };
    for (let child in graph[startNode]) {
     parents[child] = startNode;
    }
     
    // collect visited nodes
      let visited = [];
   // find the nearest node
      let node = shortestDistanceNode(distances, visited);
    
    // for that node:
    while (node) {
    // find its distance from the start node & its child nodes
     let distance = distances[node];
     let children = graph[node]; 
         
    // for each of those child nodes:
         for (let child in children) {
     
     // make sure each child node is not the start node
           if (String(child) === String(startNode)) {
             continue;
          } else {
             // save the distance from the start node to the child node
             let newdistance = distance + children[child];
   // if there's no recorded distance from the start node to the child node in the distances object
   // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
             if (!distances[child] || distances[child] > newdistance) {
   // save the distance to the object
        distances[child] = newdistance;
   // record the path
        parents[child] = node;
       } 
            }
          }  
         // move the current node to the visited set
         visited.push(node);
   // move to the nearest neighbor node
         node = shortestDistanceNode(distances, visited);
       }
     
    // using the stored paths from start node to end node
    // record the shortest path
    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
     shortestPath.push(parent);
     parent = parents[parent];
    }
    shortestPath.reverse();
     
    //this is the shortest path
    let results = {
     distance: distances[endNode],
     path: shortestPath,
    };
    // return the shortest path & the end node's distance from the start node
      return shortestPath;
   };

const gridHelper = new THREE.GridHelper(20, 20);
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
var rightButton = document.querySelector('.rightButton');
var leftButton = document.querySelector('.leftButton');
var right2Button = document.querySelector('.right2Button');
var left2Button = document.querySelector('.left2Button');
var goButton = document.querySelector('.goButton');
var toggled = false;
var currentFloor = 1;
		
raiseButton.addEventListener('click', function() {
    currentFloor += 5
    controls.target.set(0, currentFloor, 0)
    camera.position.y += 5
    controls.update();
})

lowerButton.addEventListener('click', function() {
    if (currentFloor <= 1) {
    } else {
        currentFloor -= 5
        controls.target.set(0, currentFloor, 0)
        camera.position.y -= 5
        controls.update();
    }
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
    raiseButton.disabled = true;
    lowerButton.disabled = true;
  }
})

rightButton.addEventListener('click', function() {
    o += 1
    if (o < limito) {
        for (let x = 0; x < textFile.length - 1; x++) {
            if (entrances[o] == textFile[x] + textFile[x + 1]) {
                controls.target.set(Number(textFile[x - 3]), Number(textFile[x - 2]), Number(textFile[x - 1]));
                camera.position.setZ(0);
                controls.update();
                currentEntrance = entrances[o];
            }
        }
    } else if (o >= limito) {
        o = 0
        currentEntrance = "";
        controls.target.set(0, 0, 0);
        camera.position.setZ(20);
        controls.update();
    }
})

leftButton.addEventListener('click', function() {
    o -= 1
    if (o > 0) {
        for (let x = 0; x < textFile.length - 1; x++) {
            if (entrances[o] == textFile[x] + textFile[x + 1]) {
                controls.target.set(Number(textFile[x - 3]), Number(textFile[x - 2]), Number(textFile[x - 1]));
                camera.position.setZ(0);
                controls.update();
                currentEntrance = entrances[o];
            }
        }
    } else if (o < 0) {
        o = limito - 1
        for (let x = 0; x < textFile.length - 1; x++) {
            if (entrances[o] == textFile[x] + textFile[x + 1]) {
                controls.target.set(Number(textFile[x - 3]), Number(textFile[x - 2]), Number(textFile[x - 1]));
                camera.position.setZ(0);
                controls.update();
                currentEntrance = entrances[o];
            }
        }
    } else if (o == 0) {
        controls.target.set(0, 0, 0);
        camera.position.setZ(20);
        controls.update();
        currentEntrance = "";
    }
})

right2Button.addEventListener('click', function() {
   p += 1
   if (p < limitp) {
    for (let x = 0; x < textFile.length - 1; x++) {
        if (rooms[p] == textFile[x] + textFile[x + 1]) {
            controls.target.set(Number(textFile[x - 3]), Number(textFile[x - 2]), Number(textFile[x - 1]));
            camera.position.setZ(0);
            controls.update();
            currentRoom = rooms[p];
        }
    }
} else if (p >= limitp) {
    p = 0
    controls.target.set(0, 0, 0);
    camera.position.setZ(20);
    controls.update();
    currentRoom = "";
}

})

left2Button.addEventListener('click', function() {
    p -= 1
    if (p > 0) {
        for (let x = 0; x < textFile.length - 1; x++) {
            if (rooms[p] == textFile[x] + textFile[x + 1]) {
                controls.target.set(Number(textFile[x - 3]), Number(textFile[x - 2]), Number(textFile[x - 1]));
                camera.position.setZ(0);
                controls.update();
                currentRoom = rooms[p];
            }
        }
    } else if (p < 0) {
        p = limitp - 1
        for (let x = 0; x < textFile.length - 1; x++) {
            if (rooms[p] == textFile[x] + textFile[x + 1]) {
                controls.target.set(Number(textFile[x - 3]), Number(textFile[x - 2]), Number(textFile[x - 1]));
                camera.position.setZ(0);
                controls.update();
                currentRoom = rooms[p];
            }
        }
    } else if (p == 0) {
        controls.target.set(0, 0, 0);
        camera.position.setZ(20);
        controls.update();
        currentRoom = "";
    }
})

// to do -----------------------------------------------------------------------------------------

goButton.addEventListener('click', function() {
    if (currentEntrance == "") {
        window.alert("Entrance not selected")
    } else {
        if (currentRoom == "") {
            window.alert("Room not selected")
        } else {
            var path = findShortestPath(graph, currentEntrance, currentRoom)
            var pathArray = String(path).split(",")
            const linematerial = new THREE.LineBasicMaterial( { color: 0xff0000} );
            const points = [];
            for (let x = 0; x < pathArray.length; x++) {
                for (let y = 0; y < textFile.length; y++ ) {
                    if (pathArray[x] == textFile[y] + textFile[y + 1]) {
                     points.push( new THREE.Vector3(Number(textFile[y - 3]),Number(textFile[y - 2]) ,Number(textFile[y - 1]) ) );
                    }
               }
            }
            const linegeometry = new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3(points),
              50,// path segments
              0.1,// THICKNESS
              35, //Roundness of Tube
              false, // closed
            );
            const line = new THREE.Line( linegeometry, linematerial );
            scene.add( line );
            controls.target.set(0, 0, 0);
        camera.position.setZ(20);
        controls.update();
        currentRoom = "";

        }
    }
})

function animate() {
 requestAnimationFrame(animate);
 controls.update();
 renderer.render(scene, camera);
}

animate()
