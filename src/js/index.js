
'use strict';

//LOST FUNCTIONS
/*
// detection collision with raycasters (it's shit)
function detectCollision(bullet){
    bullet.raycaster.set(bullet.hitbox.position, bullet.direction);
    var intersects = bullet.raycaster.intersectObjects(scene.children);
      for (var i = 0; i < intersects.length; i++ ) {
          intersects[i].object.material.color.set( 0xffffff );
          return true;
        }
  return false;
}
//only for testing
function drawLine(){
// Draw a line from pointA in the given direction at distance 100
var pointA = raycaster.ray.origin//new THREE.Vector3( 0, 0, 0 );
  //var direction = new THREE.Vector3( 10, 0, 0 );
raycaster.ray.direction.normalize();
var distance = 50; // at what distance to determine pointB
var pointB = new THREE.Vector3();
pointB.addVectors ( pointA, raycaster.ray.direction.multiplyScalar( distance ) );
var geometry = new THREE.Geometry();
geometry.vertices.push( pointA );
geometry.vertices.push( pointB );
var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
var line = new THREE.Line( geometry, material );
scene.add( line );
}
*/
// handle window resize (already done by threex ??)
/*
window.addEventListener('resize', function(){
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect	= window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}, false);


onRenderFcts.push(function(){
  updateTexture();
  playerMove();
  bulletsMove();
  ennemiesMove();

  //raycaster.set( player.hitbox.position, vectUp);
  var delta = 100* clockTex.getDelta();
  for (var i=0;i<mixers.length;i++){
    mixers[i].update(delta);
  }
  stats.update();
  renderer.render( scene, camera );
});

// run the rendering loop
var lastTimeMsec= null;
requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );
  // measure time
  lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
  var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec	= nowMsec;
  // call each update function

  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000);
  });
});


function loaderRess(text, points){
  //onLoad="document.body.removeChild(document.getElementById('loaderRess'));"
    if(document.getElementById('loaderRess')){
        points = (points ? points : 0);
        points = (points+1 > 3 ? 0 : points+1);
        if(!text){
            text = document.getElementById('loaderRess').childNodes[0].innerHTML;
        }
        if (points == 2) text = "It seems you have a bad connection";
        if (points == 3) text = "You can play this minigame until the end of the loading";
        var text_suspensions = text;
        for(i=0; i<points; i++){
            text_suspensions += '.';
        }

        document.getElementById('loaderRess').childNodes[0].innerHTML = text_suspensions;
        setTimeout('loaderRess(\''+text+'\', '+points+')', 500);
    }
}
    loaderRess();

*/

//GROUND
/*  var textureLoader = new THREE.TextureLoader();
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
//scene.add( plane ); */
/*
function computeHitboxEdges(box){
  var borders = box.dim/2;
  box.hitbox.minX = box.hitbox.position.x - borders;
  box.hitbox.maxX = box.hitbox.position.x + borders;
  box.hitbox.minY = box.hitbox.position.y - borders;
  box.hitbox.maxY = box.hitbox.position.y + borders;
  box.hitbox.minZ = box.hitbox.position.z - borders;
  box.hitbox.maxZ = box.hitbox.position.z + borders;
};

function updateHitboxesEdges(){
  computeHitboxEdges(player);
  for (var i=0; i<ennemies.length; i++){
    computeHitboxEdges(ennemies[i]);
  }
  for (var i=0; i<bullets.length; i++){
    computeHitboxEdges(bullets[i]);
  }
}

this.hitbox.minY = this.hitbox.position.y - this.dim/2;
this.hitbox.maxY = this.hitbox.position.y + this.dim/2;
this.hitbox.minX = this.hitbox.position.x - this.dim/2;
this.hitbox.maxX = this.hitbox.position.x + this.dim/2;
this.hitbox.minZ = this.hitbox.position.z - this.dim/2;
this.hitbox.maxZ = this.hitbox.position.z + this.dim/2;


function createennemiesMeshes(obj){
  for (var i=0; i<ennemies.length; i++){
    obj.position.set(ennemies[i].hitbox.position.x,ennemies[i].hitbox.position.y,ennemies[i].hitbox.position.z);
    mesh[i] = new THREE.Object3D();
    mesh[i] = obj;
    scene.add(mesh[i]);
    //mixer.clipAction(mesh[i].animations[0], mesh[i]).play();
    //mixer.clipAction(playerMesh.animations[0], playerMesh[i]).play();
    //addMesh(i, obj);
  }
};*/

/*  var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, side:THREE.DoubleSide } );
  var runnerGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
  var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
  runner.position.set(0,25,0); */
  //scene.add(runner);
  //SKYSPHERE
//  var skyGeometry = new THREE.SphereBufferGeometry(100, 60, 40);
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
      ennemiesMeshes[i] = obj;
      scene.add(ennemiesMeshes[i]);
      mixer.clipAction(ennemiesMeshes[i].animations[0], ennemiesMeshes[i]).play();
    }
  });*/

  /*
 var material = new THREE.MeshBasicMaterial ({color: 0xbadbad});

 geoLoader.load("src/medias/models/geoWall.json", function(geometry){
   //var geometry = new THREE.Geometry().fromBufferGeometry( bufferGeometry );
   var object = new THREE.Mesh(geometry, material);
   object.position.set(x,y,z);

   scene.add(object);
   playerMesh = object;
   scene.add(playerMesh);
 });*/
