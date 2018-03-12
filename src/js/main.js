'use strict';
// - Global Variables -
//var bulletSpeed = 0.9, ennemyShootFrequ = 800;
//var playerSpeed = 0.2, ennemySpeed = 0.1;
//var hpPlayer = 3, shootDelay = 0.5;
var leftArrowPushed = false, rightArrowPushed = false, spaceBarPushed = false;
var player, ennemies = [], bullets = [];
var groupEnnemies = new THREE.Group();
var vectUp = new THREE.Vector3(0,1,0);
var vectDown = new THREE.Vector3(0,-1,0);
var vectNull = new THREE.Vector3(0,0,0);
var vectLook = new THREE.Vector3(0,0,0);
var clock = new THREE.Clock();
var clockTex = new THREE.Clock(); //clock for the texture animation
var clockShoot = new THREE.Clock();
var lastShot = clockShoot.getElapsedTime();
var tick = 0;
var renderer, scene, camera, controls, pause=true;
var options, spawnerOptions, particleSystem;
var collisionParticle = new particleOpt();
collisionParticle.lifetime = 3;
collisionParticle.color = 0xffA500; //orange
collisionParticle.positionRandomness = 1;
collisionParticle.position.set(0,-20,10);
collisionParticle.turbulence = 0.3;
var stats;
var light, directionalLight;
var gui = new dat.GUI( {width: 350});
document.getElementById('guiContainer').appendChild(gui.domElement);
var anima; //textures animators
// array of functions for the rendering loop
//var onRenderFcts= [];player
var loader = new THREE.ObjectLoader();
var meshes = [], mixers = [];
var playerMesh;
//var mixer = new THREE.AnimationMixer(scene);
var settings = {
  level: 0,
  animaSpeed: 50,
  lifePoints: 3,
  playerMoveSpeed: 0.2,
  reloadDelay: 0.5,
  ennemyMoveSpeed: 0.1,
  shootFrequ: 800,
  bulletSpeed: 0.9
}
spawnerOptions = {
  spawnRate: 15000,
  horizontalSpeed: 1.5,
  verticalSpeed: 1.33,
  timeScale: 0.4
}
var launch = false;
var music;
THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
THREE.DefaultLoadingManager.onLoad = function ( ) {

	console.log( 'Loading Complete!');
  launch = true;
  animate();
};
//create an audio listener to add to the camera
var listener = new THREE.AudioListener();
// create a global audio source
var fate = new THREE.Audio( listener );
var pew = new THREE.Audio(  listener );
var danger = new THREE.Audio(  listener );
var boum = new THREE.Audio(  listener );
var explosion = new THREE.Audio(  listener );
var dejavu = new THREE.Audio(  listener );

  initGraphics(); //and audio
  initGui();
  switchMenu();
  //animaEnnemies();


//initObjects(8,5);
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
  //GROUND
  var textureLoader = new THREE.TextureLoader();
  var maxAnisotropy = renderer.getMaxAnisotropy();
  var texture1 = textureLoader.load( "src/medias/images/checkerboardA.png" );
  var material1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture1, transparent: true } );
  texture1.anisotropy =  maxAnisotropy;
  texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
  texture1.repeat.set( 10, 10 );
  //add plane
  var plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100), material1);
  plane.position.setZ(-1);
  //plane.scale.set( 10,10,10);
  //scene.add( plane );
  //Fog
  scene.fog = new THREE.FogExp2( 0x0000ff, 0.0035);

  //ANIMATED TEXTURES
  var runnerTexture = new THREE.ImageUtils.loadTexture( 'src/medias/images/tunnel.jpg' );
  anima = new TextureAnimator( runnerTexture, 8, 8, 64, settings.animaSpeed ); // texture, #horiz, #vert, #total, duration.

  var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, side:THREE.DoubleSide } );
  var runnerGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
  var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
  runner.position.set(0,25,0);
  //scene.add(runner);
  //SKYSPHERE
  var skyGeometry = new THREE.SphereBufferGeometry(100, 60, 40);
  /*var uniforms = {
    texture: { type: 't', value: THREE.ImageUtils.loadTexture('/path/to/my_image.jpg') }
  };*/
  /*var material = new THREE.ShaderMaterial( {
    uniforms:       uniforms,
    vertexShader:   document.getElementById('sky-vertex').textContent,
    fragmentShader: document.getElementById('sky-fragment').textContent
  });*/
  /*var skyBox = new THREE.Mesh(skyGeometry, runnerMaterial);
  skyBox.scale.set(-1, 1, 1);
  skyBox.eulerOrder = 'XZY';
  skyBox.renderDepth = 1000.0;
  skyBox.rotateX(Math.PI / 16);
  skyBox.rotateY(-Math.PI / 2);
  scene.add(skyBox);
  */
  //CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
  var geometry = new THREE.CylinderGeometry( 20, 40, 300, 32, 1, true);
  var material = new THREE.MeshBasicMaterial( {map: runnerTexture, side:THREE.BackSide} );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.setY(100);
  scene.add( cylinder );

};



/*
var meshGroup = new THREE.Group();
var loader = new THREE.ObjectLoader();
loader.load("src/medias/models/damn.json",
    function(mesh){
      meshGroup.add(mesh);
      mixer = new THREE.AnimationMixer(meshGroup);
      mixer.clipAction(meshGroup.animations[0]).play();
    });
*/
// Alternatively, to parse a previously loaded JSON structure
//var object = loader.parse( "src/medias/models/Heart2.json" );

//scene.add( object );

/*
loader.load("src/medias/models/damn.json", function(obj){
  for(var i=0; i<ennemies.length; i++){
    obj.position.set(ennemies[i].hitbox.position.x,ennemies[i].hitbox.position.y,ennemies[i].hitbox.position.z);
    meshes[i] = obj;
    scene.add(meshes[i]);
    mixer.clipAction(meshes[i].animations[0], meshes[i]).play();
  }
});*/

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////
//mixer.clipAction(clips[0]).play();
// render the scene
function animate(){
  requestAnimationFrame(animate);
  if (!pause) {
    updateTexture();
    //updateHitboxesEdges();
    updateBoundingBoxes(); 

    playerMove();
    bulletsMove();
    ennemiesMove();
  }
  //raycaster.set( player.hitbox.position, vectUp);
  var delta = 100* clockTex.getDelta();
  for (var i=0;i<mixers.length;i++){
    mixers[i].update(delta);
  }
  stats.update();
  renderer.render( scene, camera );
}
