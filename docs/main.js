
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Color fondo
scene.background = new THREE.Color(0x5e504f);

//Luz ambiental
const ambientLight = new THREE.AmbientLight(0xe0e0e0,0);
scene.add(ambientLight);

//Luz direccional
// const light = new THREE.DirectionalLight(0xffffff,0.6);
// light.position.set(0,50,0);
// scene.add(light);

const spotlight = new THREE.SpotLight('white', 2000)
spotlight.position.set(0,50,0)
spotlight.angle= Math.PI/10
//spotlight.penumbra = 0.5
scene.add(spotlight)
spotlight.castShadow=true

const spotlightHelper = new THREE.SpotLightHelper(spotlight)
scene.add(spotlightHelper)







const renderer = new THREE.WebGLRenderer();
//renderer.toneMapping = THREE.ACESFilmicToneMapping; //opciones aestethic
//renderer.outputColorSpace = THREE.SRGBColorSpace; //opciones aestethic
//renderer.setPixelRatio(window.devicePixelRatio); //opciones aestethic
renderer.setSize( window.innerWidth, window.innerHeight );

const controls = new OrbitControls( camera, renderer.domElement );

document.body.appendChild( renderer.domElement );

/*const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );  
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );*/

camera.position.z = 45;
camera.position.y = 25;

// Instantiate a loader
const gltfloader = new GLTFLoader();


let cuarto
let cargado = false
let objQueQuiero = [];

const hdriLoader = new RGBELoader()


gltfloader.load(
	// resource URL
	'/cuartillo/cuarto.gltf',
	// called when the resource is loaded
	function ( gltf ) {
    cuarto = gltf.scene
		scene.add( cuarto );

    cuarto.position.x = 7
    cargado=true

	const hijos = cuarto.children[0].children[0].children[0].children;
	console.log(hijos)

	// hijos.forEach(element => {
	// 	if(element.name == "pillow_02_lowpoly"  ){
	// 		objQueQuiero.push(element)
	// 		console.log(element);
	// 	}
	// })
	objQueQuiero.push(hijos[0]);
	objQueQuiero.push(hijos[3]);
	objQueQuiero.push(hijos[8]);
	objQueQuiero.push(hijos[9]);
	objQueQuiero.push(hijos[10]);
	objQueQuiero.push(hijos[15]);
	objQueQuiero.push(hijos[17]);
	objQueQuiero.push(hijos[18]);
	objQueQuiero.push(hijos[20]);
	objQueQuiero.push(hijos[22]);
	objQueQuiero.push(hijos[23]);
	objQueQuiero.push(hijos[24]);
	
	

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

const clock = new THREE.Clock()


document.addEventListener('mousedown',onMouseClick)


const raycaster = new THREE.Raycaster();
const mouseCoordinates = new THREE.Vector2();

function onMouseClick( event ) {

	let clickderecho = false
	if(event.button === 2){
		clickderecho = true
	}

	// calculate mouseCoordinates position in normalized device coordinates
	// (-1 to +1) for both components

	mouseCoordinates.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseCoordinates.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	raycaster.setFromCamera( mouseCoordinates, camera );
	// const objetosInter = raycaster.intersectObjects(scene.children)
	const objetosInter = raycaster.intersectObjects(arregloEsferas)


}
let inicio = 0;
let fin = 2000;
let alpha = 1;
const duracion = 5;
const incrementos = 1/ duracion;
function animate() {
  requestAnimationFrame( animate );

  let deltaTime = clock.getDelta()

  objQueQuiero.forEach(element => {
	element.rotation.z += deltaTime
  });

  if(alpha>0){
	  alpha -= deltaTime*incrementos;
  }

  if(alpha<0){
	alpha=0;
  }
  console.log(THREE.MathUtils.lerp(0,2000,alpha))
  spotlight.intensity = THREE.MathUtils.lerp(inicio,fin,alpha)

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  renderer.render( scene, camera );
}


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){ //funcion para redimensionar ventana si el usuario le anda moviendo
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

animate(); //Iniciamos el loop

