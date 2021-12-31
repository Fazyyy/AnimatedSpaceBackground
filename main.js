import './style.css';
import 'bootstrap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let skyboxImage = 'skyboxSpace';
const scene = new THREE.Scene;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), antialias: true
});

//Set scene size, controls and camera
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(30, -5, 20);
const controls = new OrbitControls(camera, renderer.domElement);

renderer.render( scene, camera );

//Add lights to scene
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)
const ambientLight = new THREE.AmbientLight(0xffffff)
pointLight.position.set(20,20,20)
scene.add(pointLight, ambientLight);

//Add a skybox
function createPathStrings() {
  const basePath = "./";
  const fileType = ".png";
  const sides = ["ft", "bk", "up", "dn", "rt", "lf"];

  const pathStings = sides.map(side => {
    return basePath + side + fileType;
  });

  return pathStings;
}

function createMaterialArray() {
  const skyboxImagepaths = createPathStrings();
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

const materialArray = createMaterialArray();
const skyboxGeo = new THREE.BoxGeometry(100, 100, 100);
const skybox = new THREE.Mesh(skyboxGeo, materialArray);
skybox.position.set(0,0,0)
scene.add(skybox);

//Set an array of stars at random op==points in 3D space
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

//Add Moon
const moonTexture = new THREE.TextureLoader().load('/moon.jpg');
const moonMap = new THREE.TextureLoader().load('/moonDisplacement.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonMap
  })
);

moon.position.set(-10,15,15);

scene.add(moon)

//Camera move on scroll
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  skybox.rotation.x += 0.005;
  skybox.rotation.y += 0.005;
}

document.body.onscroll = moveCamera;

//Create Scene
function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
  moon.rotation.y += 0.01;
}

animate()