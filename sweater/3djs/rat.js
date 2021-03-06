import * as THREE from './three.js-master/build/three.module.js';
import Stats from './three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';

import { FBXLoader } from './three.js-master/examples/jsm/loaders/FBXLoader.js';
document.addEventListener( 'click', setBackgroundImage, true);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 50);

camera.position.z = 3;
camera.position.y = 3;
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.getElementById('gl-canvas')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(512, 512);
renderer.setClearColor(0x000000, 1);
var clock = new THREE.Clock();
var mixer;

var orbit = new OrbitControls(camera, renderer.domElement);

var lights = [];
// lights[0] = new THREE.PointLight(0xffff00, 1, 0);
 //lights[1] = new THREE.PointLight(0xff00ff, 1, 0);
// lights[2] = new THREE.PointLight(0x00ffff, 1, 0);
lights[0] = new THREE.PointLight(0xaeecee, 1, 0);
lights[1] = new THREE.PointLight(0x999999, 1, 0);
//lights[2] = new THREE.PointLight(0xccffff,1, 0 );
lights[0].position.set(0, 200, 0);
//lights[1].position.set(100, 200, 100);
//lights[2].position.set(-100, -200, -100);

scene.add(lights[0]);
scene.add(lights[1]);
//scene.add(lights[2]);
var backgrounds = [
  'snowflakes.jpg',
  'hearth.jpg',
  'leaves.jpg',
  'winter_landscape.jpg'
];
var backgroundPreviews = document.getElementsByClassName('background-preview');

var group = new THREE.Group();

var geometry = new THREE.BufferGeometry();
geometry.addAttribute('position', new THREE.Float32BufferAttribute([], 3));

var lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.5
});
var meshMaterial = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  emissive: 0xccce00,
  side: THREE.DoubleSide,
  flatShading: true
});

group.add(new THREE.LineSegments(geometry, lineMaterial));
group.add(new THREE.Mesh(geometry, meshMaterial));
var loadedRat = false;
var texture;
var curSrc = "";

function setBackgroundImage (event){
    var inNum = 0;
  for (let i = 0; i < backgroundPreviews.length; i++) {
    let bg = backgroundPreviews[i];
    var bgn= bg.getAttribute("data-backgroundName")

    if (bg.classList.contains('background-preview-active')) {
        if (bgn != curSrc){
          const loaderImg = new THREE.TextureLoader();
          loaderImg.load('assets/backgrounds/' + bgn, function(bg) {
            scene.background = bg;
            scene.background.needsUpdate = true;
          });
          curSrc = bgn;
        }
    }
  }
}



function loadRat() {
  let ratvas = document.getElementById('ratvas'); // get the canvas and connect to texture
  let ctx = ratvas.getContext('2d');

  texture = new THREE.CanvasTexture(ctx.canvas); //,THREE.UVMapping,THREE.RepeatWrapping,THREE.RepeatWrapping);
  const material = new THREE.MeshBasicMaterial({
    map: texture
  });
  texture.needsUpdate = true;
  var textureRat = new THREE.TextureLoader().load( './3dAssets/ratTex.png' );
  var loader = new FBXLoader();
    console.log("in set load");

  loader.load('./3dAssets/sweaterFinal.fbx', function(object) {

    object.traverse(function(child) {
      if (child.isMesh) {
        child.material = new THREE.MeshToonMaterial({
          map: texture,
          reflectivity: 0.0,
          shininess: 0.0,
          bumpScale: 1.0
        });
        child.geometry.uvsNeedUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    group.add(object);
  });
let objectTD = new THREE.Object3D();
  loader.load('./3dAssets/rat_moves.fbx', function(object) {

    object.traverse(function(child) {
      if (child.isMesh) {
        var diffuseColor = new THREE.Color().setHSL(Math.random(), 0.3, 0.8);
        child.material = new THREE.MeshToonMaterial({
          map: textureRat,
          reflectivity: 0.0,
          shininess: 0.0,
          bumpScale: 1.0,
          color: diffuseColor
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
     //objectTD = object;
     // mixer = new THREE.AnimationMixer( object );
     // var action = mixer.clipAction( object.animations[ 0 ] );
     // action.play();
    group.add(object);
  });
}
//var options = chooseFromHash( group );

// scene.background.warpS = scene.background.warpT = THREE.RepeatWrapping;
// scene.background.repeat.set(30,30);
group.position.y -= 0.8;
scene.add(group);

var prevFog = false;

var render = function() {
  // we need all the p5 code in canvas.js to run before we can grab the canvas
  if (loadedRat == false && document.getElementById('ratvas') != null) {
    loadRat();
    loadedRat = true;
  }
  if (loadedRat == true) {
    texture.needsUpdate = true;
  }
  requestAnimationFrame(render);

    //floating around
  group.rotation.x += Math.sin(group.rotation.y * 10) * 0.001;
  group.position.y += Math.sin(group.rotation.y * 5) * 0.001;
  group.rotation.y += 0.001;
  //  var delta = clock.getDelta();
  // if ( mixer ) mixer.update( delta );
  renderer.render(scene, camera);

};


window.addEventListener(
  'resize',
  function() {
    camera.aspect = 1;
    camera.updateProjectionMatrix();

    //renderer.setSize( window.innerWidth, window.innerHeight );
  },
  false
);

render();