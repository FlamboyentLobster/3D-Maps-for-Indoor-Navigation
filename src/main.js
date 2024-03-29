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
    // return the shortest path
      return shortestPath;
   };

   class Graph {
    constructor(vertices) {
        this.V = vertices;
        this.edges = [];
    }

    addEdge(src, dest, weight) {
        this.edges.push({ src, dest, weight });
    }

    bellmanFord(startVertex) {
        const start = performance.now();
        let dist = new Array(this.V).fill(Infinity);
        dist[startVertex] = 0;

        // Relax all edges |V| - 1 times
        for (let i = 0; i < this.V - 1; i++) {
            for (let j = 0; j < this.edges.length; j++) {
                let { src, dest, weight } = this.edges[j];
                if (dist[src] !== Infinity && dist[src] + weight < dist[dest]) {
                    dist[dest] = dist[src] + weight;
                }
            }
        }

        // Check for negative weight cycles
        for (let i = 0; i < this.edges.length; i++) {
            let { src, dest, weight } = this.edges[i];
            if (dist[src] !== Infinity && dist[src] + weight < dist[dest]) {
                console.log("Graph contains negative weight cycle");
                return;
            }
        }
        const end = performance.now();
        console.log(`Execution time: ${end - start} ms`);
        return dist;
    }
}

function visualizeGraph(graph) {
    console.log("Graph:");
    console.log("Vertex -> Edges (Weight)");
    for (let i = 0; i < graph.edges.length; i++) {
        const { src, dest, weight } = graph.edges[i];
        console.log(`${src} -> ${dest} (${weight})`);
    }
}

// Bellman-Ford Graph
const bellmanFordGraph = new Graph(26);
bellmanFordGraph.addEdge(0, 1, 6);
bellmanFordGraph.addEdge(0, 2, 7);
bellmanFordGraph.addEdge(1, 2, 8);
bellmanFordGraph.addEdge(1, 3, 5);
bellmanFordGraph.addEdge(1, 4, -4);
bellmanFordGraph.addEdge(2, 3, -3);
bellmanFordGraph.addEdge(2, 4, 9);
bellmanFordGraph.addEdge(3, 1, -2);
bellmanFordGraph.addEdge(4, 3, 7);
bellmanFordGraph.addEdge(5, 6, 5);
bellmanFordGraph.addEdge(5, 7, 3);
bellmanFordGraph.addEdge(6, 8, 4);
bellmanFordGraph.addEdge(6, 9, 2);
bellmanFordGraph.addEdge(7, 8, -1);
bellmanFordGraph.addEdge(7, 10, 6);
bellmanFordGraph.addEdge(8, 11, 1);
bellmanFordGraph.addEdge(9, 10, -2);
bellmanFordGraph.addEdge(9, 12, 4);
bellmanFordGraph.addEdge(10, 11, 3);
bellmanFordGraph.addEdge(10, 13, 2);
bellmanFordGraph.addEdge(11, 13, 5);
bellmanFordGraph.addEdge(12, 14, 2);
bellmanFordGraph.addEdge(13, 14, 7);
bellmanFordGraph.addEdge(14, 15, 3);
bellmanFordGraph.addEdge(15, 16, 4);
bellmanFordGraph.addEdge(16, 17, -2);
bellmanFordGraph.addEdge(16, 18, 1);
bellmanFordGraph.addEdge(17, 19, 5);
bellmanFordGraph.addEdge(17, 20, 3);
bellmanFordGraph.addEdge(18, 20, 6);
bellmanFordGraph.addEdge(19, 21, 2);
bellmanFordGraph.addEdge(19, 22, 4);
bellmanFordGraph.addEdge(20, 22, 1);
bellmanFordGraph.addEdge(21, 23, -3);
bellmanFordGraph.addEdge(21, 24, 2);
bellmanFordGraph.addEdge(22, 24, 3);
bellmanFordGraph.addEdge(23, 25, 5);
bellmanFordGraph.addEdge(24, 25, -1);

visualizeGraph(bellmanFordGraph);

const startVertex = 0;
console.log("\nShortest distances from vertex", startVertex, "using Bellman-Ford algorithm:");
console.log(bellmanFordGraph.bellmanFord(startVertex));

 



  function floydWarshall(graph) {
    let dist = [];
    for (let i = 0; i < graph.length; i++) {
      dist[i] = [];
      for (let j = 0; j < graph.length; j++) {
        if (i === j) {
          dist[i][j] = 0;
        } else if (!isFinite(graph[i][j])) {
          dist[i][j] = Infinity;
        } else {
          dist[i][j] = graph[i][j];
        }
      }
    }
    
    for (let k = 0; k < graph.length; k++) {
      for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph.length; j++) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    } 
    return dist;
  }

  const graph26Nodes = [
    [0, 5, 2, Infinity, 3, Infinity, Infinity, Infinity, 1, 4, 7, Infinity, Infinity, Infinity, Infinity, 9, 3, Infinity, 5, 6, Infinity, 1, 4, 2, 7, 8],
    [Infinity, 0, 6, 8, Infinity, Infinity, 4, Infinity, 3, 2, 9, Infinity, 10, Infinity, Infinity, Infinity, Infinity, 2, Infinity, 3, Infinity, Infinity, 8, Infinity, 5],
    [2, Infinity, 0, 1, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, Infinity, Infinity, 0, 2, Infinity, Infinity, 5, 1, Infinity, Infinity, Infinity, Infinity, 3, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [3, Infinity, Infinity, 2, 0, 4, Infinity, 6, 8, Infinity, Infinity, Infinity, Infinity, Infinity, 5, Infinity, 1, Infinity, 2, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, Infinity, Infinity, Infinity, 4, 0, 8, 1, Infinity, 9, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, 4, Infinity, Infinity, Infinity, 8, 0, 3, Infinity, Infinity, Infinity, 4, Infinity, Infinity, 1, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, Infinity, Infinity, 5, 6, 1, 3, 0, Infinity, Infinity, Infinity, Infinity, 7, 2, 4, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [1, 3, Infinity, 1, 8, Infinity, Infinity, Infinity, 0, 6, Infinity, 2, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [4, 2, Infinity, Infinity, Infinity, 9, Infinity, Infinity, 6, 0, 5, Infinity, Infinity, 3, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [7, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 5, 0, 6, 1, Infinity, 7, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, Infinity, 2, Infinity, Infinity, Infinity, 4, Infinity, 2, Infinity, 6, 0, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, 10, 5, Infinity, Infinity, Infinity, Infinity, 7, Infinity, Infinity, 1, Infinity, 0, 3, 5, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, Infinity, Infinity, 3, Infinity, Infinity, Infinity, 2, Infinity, 3, Infinity, Infinity, 3, 0, 6, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, Infinity, Infinity, Infinity, 5, Infinity, 1, 4, Infinity, Infinity, 7, Infinity, 5, 6, 0, 4, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [9, Infinity, Infinity, Infinity, Infinity, 2, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 4, 0, 6, 5, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [3, Infinity, Infinity, Infinity, 1, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 6, 0, 7, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, 2, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 5, 7, 0, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [5, Infinity, Infinity, Infinity, 2, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 0, 1, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
    [6, 3, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 1, 0, 7, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 7, 0, 2, Infinity, Infinity, Infinity, Infinity],
    [1, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 2, 0, Infinity, Infinity, Infinity, Infinity],
    [4, 8, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 0, 3, Infinity, Infinity],
    [2, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 3, 0, Infinity, Infinity],
    [7, 5, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 0, 1],
];



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


