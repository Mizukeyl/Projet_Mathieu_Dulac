//DAT.GUI




//MODELES 3D SKETCHFAB
function initGui(){

  var folder1 = gui.addFolder( 'Player' );
  var folder2 = gui.addFolder( 'Ennemy' );
  var folder3 = gui.addFolder( 'Miscellaneous' );
  var folder4 = gui.addFolder( 'Camera');

  folder1.add(settings, "playerMoveSpeed", 0, 2).step(0.1);
  folder1.add(settings, "lifePoints", 0, 10).step(1).listen();
  folder1.add(settings, "reloadDelay", 0, 2).step(0.05);
  folder2.add(settings, "ennemyMoveSpeed", 0, 2).step(0.1);
  folder2.add(settings, "shootFrequ", 0, 2000).step(1);
  folder3.add(settings, "animaSpeed", 5, 500).step(10).onFinishChange(function(){
    anima.tileDisplayDuration = settings.animaSpeed;
  });
  folder3.add(spawnerOptions, "spawnRate", 0, 30000).step(1);
  folder3.add(spawnerOptions, "horizontalSpeed", 0, 5).step(0.05);
  folder3.add(spawnerOptions, "verticalSpeed", 0, 5).step(0.05);
  folder3.add(spawnerOptions, "timeScale", 0, 5).step(0.05);
  folder3.add(settings, "bulletSpeed", 0, 5).step(0.05);
  folder3.add( settings, "level", 0,5).step(1).onFinishChange(function(){
    document.getElementById('titre').innerHTML = "Loading "+settings.level*25+"% ...";
    switchMenu();
  });
  folder4.add(camera.position, "x", -50, 50).step(0.2).listen();
  folder4.add(camera.position, "y", -100, 50).step(0.2).listen();
  folder4.add(camera.position, "z", -50, 50).step(0.2).listen();
  folder4.add(vectLook, "x", -50, 50).step(0.2).onChange(function(){
    camera.lookAt(vectLook);
  });
  folder4.add(vectLook, "y", -50, 50).step(0.2).onChange(function(){
    camera.lookAt(vectLook);
  });
  folder4.add(vectLook, "z", -50, 50).step(0.2).onChange(function(){
    camera.lookAt(vectLook);
  });
  //folder1.open();
};
//////////////////////////////////////////////////////////////////////////////////
//		add objects
//////////////////////////////////////////////////////////////////////////////////
function initObjects(nbColumns, nbLines){
  //init particles
  options = new particleOpt(); //to test with dat.gui
  //spawnerOptions = new spawnerOpt();
  particleSystem = new THREE.GPUParticleSystem( {maxParticles: 250000} );

  //var raycaster = new THREE.Raycaster();//raycast on the player to test
  //raycaster.far = 1;
  initBullets(50);
  initEnnemies(nbColumns,nbLines);
  player = new PlayerCharacter(0,-35,0);
  scene.add( groupEnnemies );
  scene.add( player.hitbox );
  scene.add(player.boxHelper);

  scene.add(particleSystem);
};

//////////////////////////////////////////////////////////////////////////////////
//		functions
//////////////////////////////////////////////////////////////////////////////////
function switchMenu(){
  var n=0, i=0, j=0;
  switch (settings.level) {
    case 0:
      initObjects(8,5);
      break;
    case 1:
      pause=false;
      break;
    case 2:
      window.alert("menu = 2");
      for (var j=0; j< 5; j++) {
        for (var i=0; i< 8; i++){
          ennemies[n].hitbox.position.set(i*3-10, j*3+5, 0);
          ennemies[n].hitbox.visible = true;
          ennemies[n].daWae = vectUp;
          n++;
        }
      }
      player.hitbox.position.set(0,-35, 0);
      camera.position.set(0,-60,20);
      break;
    default:
      window.alert("menu value incorrect");
  }
};
function computeHitboxEdges(box){
  var borders = box.dim/2;
  box.hitbox.minX = box.hitbox.position.x - borders;
  box.hitbox.maxX = box.hitbox.position.x + borders;
  box.hitbox.minY = box.hitbox.position.y - borders;
  box.hitbox.maxY = box.hitbox.position.y + borders;
  box.hitbox.minZ = box.hitbox.position.z - borders;
  box.hitbox.maxZ = box.hitbox.position.z + borders;
};

function PlayerCharacter(x,y,z){
  loader.load("src/medias/models/ae86.json", function(obj){
    obj.position.set(x,y,z);
    playerMesh = obj;
    scene.add(playerMesh);
  });
  this.dim = 1;
  this.alive = true;
  this.daWae = vectUp; //the way of the movement
  this.hitbox = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  this.hitbox.position.set(x,y,z);
  this.boundingBox = new THREE.Box3().setFromObject(this.hitbox);
  this.boxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
  this.hitbox.minY = this.hitbox.position.y - this.dim/2;
  this.hitbox.maxY = this.hitbox.position.y + this.dim/2;
  this.hitbox.minX = this.hitbox.position.x - this.dim/2;
  this.hitbox.maxX = this.hitbox.position.x + this.dim/2;
  this.hitbox.minZ = this.hitbox.position.z - this.dim/2;
  this.hitbox.maxZ = this.hitbox.position.z + this.dim/2;
}
//add characters
function Character(m,model3D,scorePts, x,y,z){

  loader.load(model3D, function(obj){
    obj.position.set(x,y,z);
    meshes[m] = obj;
    scene.add(meshes[m]);
    //m++;
  });
  this.scorePts = scorePts;
  this.dim = 1;
  this.alive = true;
  this.daWae = vectUp; //the way of the movement
  this.hitbox = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  this.hitbox.position.set(x,y,z);
  this.boundingBox = new THREE.Box3().setFromObject(this.hitbox);
  this.boxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
  scene.add(this.boxHelper);
  this.hitbox.minY = this.hitbox.position.y - this.dim/2;
  this.hitbox.maxY = this.hitbox.position.y + this.dim/2;
  this.hitbox.minX = this.hitbox.position.x - this.dim/2;
  this.hitbox.maxX = this.hitbox.position.x + this.dim/2;
  this.hitbox.minZ = this.hitbox.position.z - this.dim/2;
  this.hitbox.maxZ = this.hitbox.position.z + this.dim/2;
};
//add bullets
function Bullet(index, x,y,z, direction){
  this.scorePts = 100;
  this.alive = false;
  this.index = index;
  this.dim = 0.30;
  this.hitbox = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff0000}) );
  this.particleOptions = new particleOpt();
  this.particleOptions.position.set(x,y,z);
  this.hitbox.position.set(x,y,z);
  this.boundingBox = new THREE.Box3().setFromObject(this.hitbox);
  this.boxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
  scene.add(this.boxHelper);
  this.hitbox.minY = this.hitbox.position.y - this.dim/2;
  this.hitbox.maxY = this.hitbox.position.y + this.dim/2;
  this.hitbox.minX = this.hitbox.position.x - this.dim/2;
  this.hitbox.maxX = this.hitbox.position.x + this.dim/2;
  this.hitbox.minZ = this.hitbox.position.z - this.dim/2;
  this.hitbox.maxZ = this.hitbox.position.z + this.dim/2;
  this.direction = direction;
};
function initEnnemies(nbColumns,nbLines){
  var n=0;
  for (var j=0; j<nbLines; j++) {
    for (var i=0; i<nbColumns; i++){
      ennemies[n] = new Character(n,"src/medias/models/damn.json",30, (i*3-10), (j*3+5), 0);
      groupEnnemies.add(ennemies[n].hitbox);
      n++;
    }
  }
};
function initBullets(nbBullet){
  for (var i=0; i<nbBullet; i++){
    bullets[i] = new Bullet(i, -5,0,15, vectNull);
    scene.add(bullets[i].hitbox);
  }
};

function createMeshes(obj){
  for (var i=0; i<ennemies.length; i++){
    obj.position.set(ennemies[i].hitbox.position.x,ennemies[i].hitbox.position.y,ennemies[i].hitbox.position.z);
    mesh[i] = new THREE.Object3D();
    mesh[i] = obj;
    scene.add(mesh[i]);
    mixer.clipAction(mesh[i].animations[0], mesh[i]).play();
    //addMesh(i, obj);
  }
};

// options passed during each spawned
function particleOpt() {
  this.position = new THREE.Vector3();
  this.positionRandomness = .2;
  this.velocity = new THREE.Vector3();
  this.velocityRandomness = .2;
  this.color = 0xaa88ff;
  this.colorRandomness = .2;
  this.turbulence = .02;
  this.lifetime = 1;
  this.size = 6;
  this.sizeRandomness = 1;
};
function spawnerOpt() {
  this.spawnRate = 15000;
  this.horizontalSpeed = 1.5;
  this.verticalSpeed =  1.33;
  this.timeScale = 0.4;
};


//manage player's movements
function playerMove() {

  if (leftArrowPushed) {
    if (player.hitbox.position.x > -20){
      player.hitbox.position.x -= settings.playerMoveSpeed;
      playerMesh.position.x -= settings.playerMoveSpeed;
      camera.position.x -= settings.playerMoveSpeed;
    }
  }
  if (rightArrowPushed) {
    if (player.hitbox.position.x < 20){
      player.hitbox.position.x += settings.playerMoveSpeed;
      playerMesh.position.x += settings.playerMoveSpeed;
      camera.position.x += settings.playerMoveSpeed;
    }
  }
  if (spaceBarPushed) {
    //if (clockShoot.getDelta() > 0.5) {
    if (clockShoot.getElapsedTime() - lastShot > settings.reloadDelay){
      shoot(vectUp,player.hitbox.position);
      if (pew.isPlaying) boum.play();
      else pew.play();
      lastShot = clockShoot.getElapsedTime();
    }
  }
};
//keyboard inputs
document.addEventListener("keydown", onDocumentKeyDown, true);
document.addEventListener("keyup", onDocumentKeyUp, true);
function onDocumentKeyDown(event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  //var keyCode = event.key;
  switch (event.key) {
    case "Tab":
      animaEnnemies();
      dejavu.play();
      break;
    case " ":
      spaceBarPushed = true;
      //playerMove()
      break;
    case "ArrowLeft":
      leftArrowPushed = true;
      //playerMove();
      break;
    case "ArrowRight":
      rightArrowPushed = true;
      //playerMove();
      break;
    case "ArrowDown":
      //mixer.clipAction(meshes[2].animations[0], meshes[2]).play();
      //switchMenu();
      break;
    case "Escape":
      pause = (pause ? false: true);
      break;
    default:
      return;
  }
  event.preventDefault();
};
function onDocumentKeyUp(event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  //var keyCode = event.key;
  switch (event.key) {
    case "Tab":
      spaceBarPushed = false;
      break;
    case " ":
      spaceBarPushed = false;
      break;
    case "ArrowLeft":
      leftArrowPushed = false;
      break;
    case "ArrowRight":
      rightArrowPushed = false;
      break;
    case "x":
      bomb();
      break;
    case "g":
      document.getElementById("speedAnim").style.display = "none";
      break;
    case "h":
      document.getElementById("speedAnim").style.display = "block";
      break;
    default:
      return;
  }
  event.preventDefault();
};



//manage bullets movements
function bulletsMove(){
  for (var i=0; i<bullets.length; i++){
    if (bullets[i].alive) {
      if (bullets[i].direction == vectUp) {
        bullets[i].hitbox.position.y += settings.bulletSpeed;
      //  bullets[i].hitbox.position.z += Math.sin(bullets[i].hitbox.position.y);
      //  bullets[i].hitbox.position.x += Math.sin(bullets[i].hitbox.position.y/2);
        bullets[i].particleOptions.color = 0xaa88ff; //white
      }
      else if (bullets[i].direction == vectDown) {
        bullets[i].hitbox.position.y -= settings.bulletSpeed;
        bullets[i].particleOptions.color = 0xff0000; //red
      }
      bullets[i].particleOptions.position.set(
        bullets[i].hitbox.position.x,
        bullets[i].hitbox.position.y,
        bullets[i].hitbox.position.z
      );
    }
    //computeHitboxEdges(bullets[i]);
    bullets[i].boundingBox.setFromObject(bullets[i].hitbox);
    fullDetectCollision(bullets[i]);
    if (collisionParticle.position.z < 1) {
      collisionParticle.position.z += settings.bulletSpeed/100;
    }
    if (bullets[i].hitbox.position.y >= 30 || bullets[i].hitbox.position.y <= -40) { //reset the bullets who goes too far
//bullets[i].hitbox.visible = false;
      bullets[i].alive = false;
      bullets[i].hitbox.position.setZ(20);
      bullets[i].particleOptions.position.setZ(15);
    }
  }
  //bullets particles
  var delta = clock.getDelta() * spawnerOptions.timeScale;
  tick += delta;
  if ( tick < 0 ) tick = 0;
  if ( delta > 0 ) {
    for ( var x = 0; x < spawnerOptions.spawnRate * delta; x++ ) {
      //bullets.forEach(function(elt)
      for (var i=0; i<bullets.length;i++){
        if (bullets[i].alive){
          particleSystem.spawnParticle( bullets[i].particleOptions );
        }
      }
      if (collisionParticle.position.z < 1) {
        particleSystem.spawnParticle( collisionParticle );
        //if (tick == 0) collisionParticle.position.set(0,-20,10);
      }
    }
  }
  particleSystem.update( tick );
}

function updateBoundingBoxes(){
  player.boundingBox.setFromObject(player.hitbox);
  for (var i=0; i<ennemies.length; i++){
    ennemies[i].boundingBox.setFromObject(ennemies[i].hitbox);
  }
  for (var i=0; i<bullets.length; i++){
      bullets[i].boundingBox.setFromObject(bullets[i].hitbox);
  }
}

function updateHitboxesEdges(){
  computeHitboxEdges(player);
  for (var i=0; i<ennemies.length; i++){
    computeHitboxEdges(ennemies[i]);
  }
  for (var i=0; i<bullets.length; i++){
    computeHitboxEdges(bullets[i]);
  }
}

function fullDetectCollision(bullet){
  if (bullet.direction == vectDown){ //collision between bullets and player
    //computeHitboxEdges(player); //use box3 instead
    player.boundingBox.setFromObject(player.hitbox);
    //if (isCollision(bullet,player)) { //use box3 instead
    if (bullet.boundingBox.intersectsBox(player.boundingBox)) {
      collisionParticle.position.set(player.hitbox.position.x,player.hitbox.position.y,player.hitbox.position.z);
//bullet.hitbox.visible = false;
      bullet.hitbox.position.setZ(15);
      bullet.alive = false;
      bullet.particleOptions.position.setZ(15);
      settings.lifePoints--;
      if (settings.lifePoints <= 0) {
        window.alert("Fin du game");
      }
    }
  }
  else {
    for (var i=0; i<ennemies.length; i++){ //collision between bullets and ennemies
      //computeHitboxEdges(ennemies[i]);
      ennemies[i].boundingBox.setFromObject(ennemies[i].hitbox);
      //if (isCollision(bullet,ennemies[i])) {
      if (bullet.boundingBox.intersectsBox(ennemies[i].boundingBox)) {
//bullet.hitbox.visible = false;
        bullet.alive = false;
        bullet.hitbox.position.setZ(15);
        bullet.particleOptions.position.setZ(15);
        collisionParticle.position.set(ennemies[i].hitbox.position.x,ennemies[i].hitbox.position.y,ennemies[i].hitbox.position.z);
        ennemies[i].hitbox.visible = false;
        ennemies[i].hitbox.position.setZ(4);
        ennemies[i].alive = false;
        meshes[i].visible = false;
        score += ennemies[i].scorePts;

      }
    }
    for (var i=0; i<bullets.length; i++){ //collision between bullets
      if (bullets[i].direction == vectDown){
        //computeHitboxEdges(bullets[i]);
        bullets[i].boundingBox.setFromObject(bullets[i].hitbox);
        //if (isCollision(bullet,bullets[i])){
        if (bullet.boundingBox.intersectsBox(bullets[i].boundingBox)){
          collisionParticle.position.set(bullets[i].hitbox.position.x,bullets[i].hitbox.position.y,bullets[i].hitbox.position.z);
//bullet.hitbox.visible = false;
          bullets[i].hitbox.visible = false;
          bullet.hitbox.position.setZ(5);
          bullet.alive = false;
          bullet.particleOptions.position.setZ(15);
          bullets[i].hitbox.position.setZ(18);
          bullets[i].alive = false;
          bullets[i].particleOptions.position.setZ(15);
          score += bullet[i].scorePts;
        }
      }
    }
  }
}

function isCollision(a, b) {
return	(a.hitbox.minX <= b.hitbox.maxX && a.hitbox.maxX >= b.hitbox.minX) &&
      (a.hitbox.minY <= b.hitbox.maxY && a.hitbox.maxY >= b.hitbox.minY) &&
      (a.hitbox.minZ <= b.hitbox.maxZ && a.hitbox.maxZ >= b.hitbox.minZ)
}

function animaEnnemies(){
  for (var i=0; i<ennemies.length; i++){
    mixers[i] = new THREE.AnimationMixer(scene);
    //window.alert(meshes[i]);
    mixers[i].clipAction(meshes[i].animations[0], meshes[i]).play();
  }
}
//AI of the ennemies
function ennemiesMove(){
  for (var i=0; i<ennemies.length; i++){
    if (ennemies[i].alive){//ennemy is alive
      //probability of shooting
      if (Math.floor(Math.random()*settings.shootFrequ) == 0) {shoot(vectDown,ennemies[i].hitbox.position)}
      //ennemies movements
      if (ennemies[i].daWae == vectUp) {
        ennemies[i].hitbox.position.x += settings.ennemyMoveSpeed;
        meshes[i].position.x += settings.ennemyMoveSpeed;
        if (ennemies[i].hitbox.position.x > 20) {
          ennemies[i].daWae = vectDown;
          ennemies[i].hitbox.position.y -= 2;
          meshes[i].position.y -= 2;
        }
      }
      else if (ennemies[i].daWae == vectDown) {
        ennemies[i].hitbox.position.x -= settings.ennemyMoveSpeed;
        meshes[i].position.x -= settings.ennemyMoveSpeed;
        if (ennemies[i].hitbox.position.x < -20) {
          ennemies[i].daWae = vectUp;
          ennemies[i].hitbox.position.y -= 2;
          meshes[i].position.y -= 2;
        }
      }
    }
  }
}

//summon a bullet at the position
//take the first bullet that isn't moving into the battlefield
//if no bullet are available, it will reset all the bullets (should'nt happen if the bullets array is large enought)
function shoot(direction, position){
  var j = 0;
  while (bullets[j].alive) { //loop if the bullet[j] is flying
    if (j < bullets.length-1){
      j++;
    } else { //all bullets have been fired
      //bullets[0].hitbox.visible = false;
      bullets[0].hitbox.position.setZ(5);
      bullets[0].alive = false;
      bullets[0].particleOptions.position.setZ(15);
      j=0;
      /*
      for (var i=0; i<bullets.length; i++){ //clear all bullets
        bullets[i].hitbox.visible = false;
        bullets[i].hitbox.position.setZ(5);
        bullets[i].particleOptions.position.setZ(15);
      }
      */
    }
  }
  bullets[j].direction = direction;
  bullets[j].hitbox.position.set(
    position.x,
    position.y,
    position.z)
  bullets[j].hitbox.visible = true;
  bullets[j].alive = true;
}

function bomb(){
  var vectPos = new THREE.Vector3(0,0,0);
  vectPos.set(player.hitbox.position.x,player.hitbox.position.y,player.hitbox.position.z);
  vectPos.x -= 20;
  for (var i=0; i<40; i++){
    vectPos.x ++;
    vectPos.y += (Math.random()-0.2);
    shoot(vectUp, vectPos);
  }
}

/*
  function TextureAnimator from
  Three.js "tutorials by example"
  Author: Lee Stemkoski
  Date: July 2013 (three.js v59dev)
*/
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration)
{
  // note: texture passed by reference, will be updated by the update function.

  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet.
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;

  // how long has the current image been displayed?
  this.currentDisplayTime = 0;

  // which image is currently being displayed?
  this.currentTile = 0;

  this.update = function( milliSec )
  {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration)
    {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile == this.numberOfTiles)
        this.currentTile = 0;
      var currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
      texture.offset.y = currentRow / this.tilesVertical;
    }
  };
}
function updateTexture(){
  var deltaTex = clockTex.getDelta();
  anima.update(1000*deltaTex);
}

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
