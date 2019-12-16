
import * as THREE from './three.js-master/build/three.module.js';
import Stats from './three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';

import { FBXLoader } from './three.js-master/examples/jsm/loaders/FBXLoader.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
camera.position.z = 3;
camera.position.y = 3;
var renderer = new THREE.WebGLRenderer( { antialias: true, canvas: document.getElementById("gl-canvas") } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( 512, 512 );
renderer.setClearColor( 0x000000, 1 );

var orbit = new OrbitControls( camera, renderer.domElement );

var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffff00, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xff00ff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0x00ffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

var group = new THREE.Group();

var geometry = new THREE.BufferGeometry();
geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );

var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
var meshMaterial = new THREE.MeshPhongMaterial( { color: 0xffff00, emissive: 0xccce00, side: THREE.DoubleSide, flatShading: true } );

group.add( new THREE.LineSegments( geometry, lineMaterial ) );
group.add( new THREE.Mesh( geometry, meshMaterial ) );
var loadedRat = false
var texture
function loadRat(){
    let ratvas = document.getElementById('ratvas') // get the canvas and connect to texture 
    let ctx = ratvas.getContext('2d')
    //ctx.canvas.width = 512;
    //ctx.canvas.height = 512;
    texture = new THREE.CanvasTexture(ctx.canvas);//,THREE.UVMapping,THREE.RepeatWrapping,THREE.RepeatWrapping);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    texture.needsUpdate = true
    var loader = new FBXLoader();

    loader.load( './3dAssets/sweater.fbx', function ( object ) {
    // mixer = new THREE.AnimationMixer( object );
    // var action = mixer.clipAction( object.animations[ 0 ] );
    // action.play();
    	object.traverse( function ( child ) {
    	if ( child.isMesh ) {

    		child.material = new THREE.MeshBasicMaterial({
    		  map: texture
    		});
            child.castShadow = true;
            child.receiveShadow = true;
    	}
    	} );
    	scene.add( object );
    } );

    loader.load( './3dAssets/rat.fbx', function ( object ) {

    	object.traverse( function ( child ) {
    	if ( child.isMesh ) {
    		child.castShadow = true;
    		child.receiveShadow = true;
    	}
    	} );
    	scene.add( object );
    } );
}
//var options = chooseFromHash( group );

// scene.background = new THREE.CubeTextureLoader()
// 	.setPath( './' )
// 	.load( [
// 		'rat.png',
// 		'rat.png',
// 		'rat.png',
// 		'rat.png',
// 		'rat.png',
// 		'rat.png'

// 	] );
// scene.background.warpS = scene.background.warpT = THREE.RepeatWrapping;
// scene.background.repeat.set(30,30); 

scene.add( group );

var prevFog = false;

var render = function () {

    if (loadedRat == false && document.getElementById('ratvas') != null){
        loadRat()
        loadedRat = true
    }
    if (loadedRat == true){
        texture.needsUpdate = true
    }
	requestAnimationFrame( render );

	//if ( ! options.fixed ) {

		group.rotation.x += 0.05;
		group.rotation.y += 0.05;

	//}

	renderer.render( scene, camera );

};

window.addEventListener( 'resize', function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	//renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();
