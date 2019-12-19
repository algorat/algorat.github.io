
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
var backgrounds = ['winter_landscape.jpg',
        'snowflakes.jpg',
        'leaves.jpg',
        'hearth.jpg']
var randomNumber = Math.floor(Math.random()*backgrounds.length);
var backgroundName = backgrounds[randomNumber];

// scene.background = new THREE.CubeTextureLoader()
//  .setPath( 'assets/backgrounds/' )
//  .load( [
//      backgroundName,
//      backgroundName,
//      backgroundName,
//      backgroundName,
//      backgroundName,
//      backgroundName,

//  ] );

 //Load background texture
const loaderImg = new THREE.TextureLoader();
loaderImg.load('assets/backgrounds/' + backgroundName , function(bg)
            {
             scene.background = bg;  
            });

    texture = new THREE.CanvasTexture(ctx.canvas);//,THREE.UVMapping,THREE.RepeatWrapping,THREE.RepeatWrapping);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    texture.needsUpdate = true
    var loader = new FBXLoader();

    loader.load( './3dAssets/sweater2.fbx', function ( object ) {
    // mixer = new THREE.AnimationMixer( object );
    // var action = mixer.clipAction( object.animations[ 0 ] );
    // action.play();
    	object.traverse( function ( child ) {
    	if ( child.isMesh ) {

    		child.material = new THREE.MeshBasicMaterial({
    		  map: texture,
                reflectivity: 1.0,
                shininess: 1.0,
                bumpScale: 1.0
    		});
            child.geometry.uvsNeedUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
    	}
    	} );
    	group.add( object );
    } );

    loader.load( './3dAssets/rat.fbx', function ( object ) {

    	object.traverse( function ( child ) {
    	if ( child.isMesh ) {
            var diffuseColor = new THREE.Color().setHSL( Math.random(),0.2,0.2);

            child.material = new THREE.MeshToonMaterial( {
                                reflectivity: 1.0,
                                shininess: 1.0,
                                bumpScale: 1.0,
                                color: diffuseColor
                            } );
    		child.castShadow = true;
    		child.receiveShadow = true;
    	}
    	} );
    	group.add( object );
    } );

}
//var options = chooseFromHash( group );



// scene.background.warpS = scene.background.warpT = THREE.RepeatWrapping;
// scene.background.repeat.set(30,30); 
group.position.y -= 0.8;
scene.add( group );

var prevFog = false;

var render = function () {
    // we need all the p5 code in canvas.js to run before we can grab the canvas
    if (loadedRat == false && document.getElementById('ratvas') != null){
        loadRat()
        loadedRat = true
    }
    if (loadedRat == true){
        texture.needsUpdate = true
    }
	requestAnimationFrame( render );

	//if ( ! options.fixed ) {

		group.rotation.x += Math.sin(group.rotation.y* 10)* 0.001;
        group.position.y += Math.sin(group.rotation.y* 5)* 0.001;
		group.rotation.y += 0.001;

	//}

	renderer.render( scene, camera );

};

window.addEventListener( 'resize', function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	//renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();
