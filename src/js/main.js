'use strict';
// - Global Variables -
var renderer, scene, camera, controls, pause=true;
var stats;
var light, directionalLight;
var gui = new dat.GUI( {width: 350});
document.getElementById('guiContainer').appendChild(gui.domElement);
var anima; //textures animators
var alphaMesh;
var loader = new THREE.ObjectLoader();
var geoLoader = new THREE.BufferGeometryLoader();

//CHARACTERS
var xZoneLimit = 20, yZoneLimit = 40;
var ennemiesMeshes = [], mixers = []; //mixers for animations
var playerMesh, playerMixer;
var wallsMeshes = [];
var leftArrowPushed = false, rightArrowPushed = false, spaceBarPushed = false;
var player, ennemies = [], bullets = [], walls = [];
var score = 0;
var groupEnnemies = new THREE.Group();
var vectUp = new THREE.Vector3(0,1,0);
var vectDown = new THREE.Vector3(0,-1,0);
var vectNull = new THREE.Vector3(0,0,0);
var vectLook = new THREE.Vector3(0,0,0);

//CLOCKS
var clock = new THREE.Clock();
var clockTex = new THREE.Clock(); //clock for the texture animation
var clockShoot = new THREE.Clock();
var lastShot = clockShoot.getElapsedTime();
var tick = 0;

//PARTICLES
var options, spawnerOptions, particleSystem;
var collisionParticle = [];

//Gui var
var settings = {
  level: 0,
  animaSpeed: 50,
  lifePoints: 3,
  playerMoveSpeed: 0.2,
  reloadDelay: 0.5,
  ennemyMoveSpeed: 0.1,
  shootFrequ: 800,
  bulletSpeed: 0.7
}
spawnerOptions = {
  spawnRate: 20000,
  horizontalSpeed: 1.5,
  verticalSpeed: 1.33,
  timeScale: 1
}

//AUDIO
var music;
var listener = new THREE.AudioListener();
// create a global audio source
var fate = new THREE.Audio( listener );
var pew = new THREE.Audio(  listener );
var danger = new THREE.Audio(  listener );
var boum = new THREE.Audio(  listener );
var explosion = new THREE.Audio(  listener );
var dejavu = new THREE.Audio(  listener );

//LOADING MANAGER
var launch = false;
THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
THREE.DefaultLoadingManager.onLoad = function ( ) {
	console.log( 'Loading Complete!');
  launch = true;
  animate();
};


//INIT FUNCTIONS
initGraphics(); //and audio
initGui();
switchMenu();

//////////////////////////////////////////////////////////////////////////////////
//		Init
// git examples : physics / convex / break
//////////////////////////////////////////////////////////////////////////////////


function initGraphics(){

  // init renderer
  renderer = new THREE.WebGLRenderer({
    antialias	: true,
    preserveDrawingBuffer: true
  });
  renderer.setClearColor(new THREE.Color('lightgrey'), 1);
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //container.appendChild( renderer.domElement );

  // init scene and camera
  scene	= new THREE.Scene();
  camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(0,-65,20);
  camera.up.set(0,0,1);
  controls	= new THREE.OrbitControls(camera);
  // transparently support window resize
  THREEx.WindowResize.bind(renderer, camera);
  // allow 'p' to make screenshot
  THREEx.Screenshot.bindKey(renderer);
  // allow 'f' to go fullscreen where this feature is supported
  if( THREEx.FullScreen.available() ){
    THREEx.FullScreen.bindKey();
    //document.getElementById('container').innerHTML	+= "- <i>f</i> for fullscreen";
  }
  //add the AudioListener to the camera
  camera.add( listener );
  // load a sound and set it as the Audio object's buffer
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load( 'src/medias/sounds/fateOfTheUnknown.mp3', function( buffer ) {
    fate.setBuffer( buffer );
    fate.setLoop(true);
    fate.setVolume(1.0);
  });
  audioLoader.load( 'src/medias/sounds/pew.mp3', function( buffer ) {
    pew.setBuffer( buffer );
    pew.setLoop(false);
    pew.setVolume(1.0);
  });
  audioLoader.load( 'src/medias/sounds/boum.mp3', function( buffer ) {
    boum.setBuffer( buffer );
    boum.setLoop(false);
    boum.setVolume(1.0);
  });
  audioLoader.load( 'src/medias/sounds/dejavu.mp3', function( buffer ) {
    dejavu.setBuffer( buffer );
    dejavu.setLoop(false);
    dejavu.setVolume(1.0);
  });
  audioLoader.load( 'src/medias/sounds/danger.mp3', function( buffer ) {
    danger.setBuffer( buffer );
    danger.setLoop(false);
    danger.setVolume(1.0);
  });
  audioLoader.load( 'src/medias/sounds/explosion.mp3', function( buffer ) {
    explosion.setBuffer( buffer );
    explosion.setLoop(false);
    explosion.setVolume(1.0);
  });

  //show fps
  stats = new Stats();
  //stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '10px';
  container.appendChild( stats.domElement );
  //document.getElementById('container').appendChild( stats.domElement);
  //manage light
  light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );
  // White directional light at 70% intensity shining from the top.
  directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
  directionalLight.position.set(1,1,1);
  scene.add( directionalLight );

  //Fog
  scene.fog = new THREE.FogExp2( 0x0000ff, 0.0035);

  function addObjects(scene) {
         //var geometry = new THREE.IcosahedronGeometry(30, 5);
         var geometry = new THREE.CylinderGeometry( 20, 40, 300, 32, 1, true);

         var material = new THREE.MeshStandardMaterial({ color: "#444", transparent: true, side: THREE.DoubleSide, alphaTest: 0.5, opacity: 0.9, roughness: 1 });

         // this image is loaded as data uri. Just copy and paste the string contained in "image.src" in your browser's url bar to see the image.
         // alpha texture used to regulate transparency
         var image = document.createElement('img');
         var alphaMap = new THREE.Texture(image);
         image.onload = function()  {
             alphaMap.needsUpdate = true;
         };
         image.src = 'src/medias/images/alphaWall.png';
         material.alphaMap = alphaMap;
         material.alphaMap.magFilter = THREE.NearestFilter;
         material.alphaMap.wrapT = THREE.RepeatWrapping;
         material.alphaMap.repeat.y = 1;

         var mesh = new THREE.Mesh(geometry, material);
         mesh.position.setY(100);
         scene.add(mesh);
         return mesh;
     }
  alphaMesh = addObjects(scene);



  //ANIMATED TEXTURES
  var runnerTexture = new THREE.ImageUtils.loadTexture( 'src/medias/images/tunnel.jpg' );
  anima = new TextureAnimator( runnerTexture, 8, 8, 64, settings.animaSpeed ); // texture, #horiz, #vert, #total, duration.
  //CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
  var geometry = new THREE.CylinderGeometry( 20, 50, 300, 32, 1, true);
  //var geometry = new THREE.SphereBufferGeometry(150, 60, 40);
  var material = new THREE.MeshBasicMaterial( {map: runnerTexture, side:THREE.BackSide} );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.setY(100);
  scene.add( cylinder );

};




//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////
//mixer.clipAction(clips[0]).play();
// render the scene
var time =0;
function animate(){
  requestAnimationFrame(animate);

  if (!pause) {
    time++;
    alphaMesh.material.alphaMap.offset.y = time*0.008;
    playerMesh.material.alphaMap.offset.y = time*0.005;
    for (var i = 0; i < wallsMeshes.length; i++) {
      wallsMeshes[i].material.alphaMap.offset.y = time*0.005;
    }

    updateTexture();
    //updateHitboxesEdges();
    updateBoundingBoxes();

    playerMove();
    bulletsMove();
    ennemiesMove();
    var delta = 100* clockTex.getDelta();
    for (var i=0;i<mixers.length;i++){
      mixers[i].update(delta);
    }
    //playerMixer.update(delta);

    document.getElementById('scorePts').innerHTML = score;
  }
  //raycaster.set( player.hitbox.position, vectUp);

  stats.update();
  renderer.render( scene, camera );
}
