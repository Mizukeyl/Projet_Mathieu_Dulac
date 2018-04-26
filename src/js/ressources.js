//DAT.GUI

//MODELES 3D SKETCHFAB
function initGui(){

  var folder1 = gui.addFolder( 'Player' );
  var folder2 = gui.addFolder( 'Ennemy' );
  var folder3 = gui.addFolder( 'Miscellaneous' );
  var folder4 = gui.addFolder( 'Camera');

  folder1.add(settings, "playerMoveSpeed", 0, 2).step(0.1);
  folder1.add(settings, "lifePoints", 0, 100).step(1).listen();
  folder1.add(settings, "reloadDelay", 0, 2).step(0.05);
  folder2.add(settings, "ennemyMoveSpeed", 0, 2).step(0.1);
  folder2.add(settings, "shootFrequ", 0, 2000).step(1);
  folder3.add(settings, "animaSpeed", 5, 500).step(10).onFinishChange(function(){
    anima.tileDisplayDuration = settings.animaSpeed;
  });
  folder3.add(spawnerOptions, "spawnRate", 0, 80000).step(1);
  folder3.add(spawnerOptions, "horizontalSpeed", 0, 5).step(0.05);
  folder3.add(spawnerOptions, "verticalSpeed", 0, 5).step(0.05);
  folder3.add(spawnerOptions, "timeScale", 0, 5).step(0.05);
  folder3.add(settings, "bulletSpeed", 0, 5).step(0.05);
  folder3.add( settings, "level", 0,5).step(1).onFinishChange(function(){
    document.getElementById('titre').innerHTML = "Loading "+settings.level*25+"% ...";
    switchMenu();
  });
  folder4.add(chaseCamera.position, "x", -50, 50).step(0.2).listen();
  folder4.add(chaseCamera.position, "y", -100, 50).step(0.2).listen();
  folder4.add(chaseCamera.position, "z", -50, 50).step(0.2).listen();
  folder4.add(vectLook, "x", -50, 50).step(0.2).onChange(function(){
    chaseCamera.lookAt(vectLook);
  });
  folder4.add(vectLook, "y", -50, 50).step(0.2).onChange(function(){
    chaseCamera.lookAt(vectLook);
  });
  folder4.add(vectLook, "z", -50, 50).step(0.2).onChange(function(){
    chaseCamera.lookAt(vectLook);
  });
  //folder1.open();
};
//////////////////////////////////////////////////////////////////////////////////
//		add objects
//////////////////////////////////////////////////////////////////////////////////
function initObjects(nbColumns, nbLines){
  //init particles
  options = new particleOpt(); //to test with dat.gui
  particleSystem = new THREE.GPUParticleSystem( {maxParticles: 250000} );
  initBullets(50);
  initEnnemies(nbColumns,nbLines);
  player = new PlayerCharacter(0,-35,0);
  initWalls(5);
  //scene.add( groupEnnemies ); //hitbox
  //scene.add( player.hitbox );
  //scene.add(player.boxHelper);
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
      animaEnnemies();
      pause=false;
      break;
    case 2:
      window.alert("menu = 2");
      for (var j=0; j< 5; j++) {
        for (var i=0; i< 8; i++){
          ennemies[n].hitbox.position.set(i*3-10, j*3+5, 0);
          ennemiesMeshes[n].position.set(i*3-10, j*3+5, 0);
          ennemies[n].daWae = vectUp;
          ennemies[n].alive = true;
          ennemies[n].hitbox.visible = true;
          ennemiesMeshes[n].visible = true;
          n++;
        }
      }
      player.hitbox.position.set(0,-35, 0);
      chaseCamera.position.set(0,-65,20);
      break;
    default:
      window.alert("menu value incorrect");
  }
};

function PlayerCharacter(x,y,z){
  loader.load("src/medias/models/necro-book-decimated.json", function(obj){
    obj.position.set(x,y,z);
    //this.material = new THREE.MeshBasicMaterial({color: 0x000000});
    playerMesh = obj;
    //playerMesh.material.alphaMap.magFilter = THREE.NearestFilter;
    //playerMesh.material.alphaMap.wrapT = THREE.RepeatWrapping;
    //playerMesh.material.alphaMap.repeat.y = 1;
    scene.add(playerMesh);
  });
  this.dim = 1;
  this.alive = true;
  this.daWae = vectUp; //the way of the movement
  this.hitbox = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  this.hitbox.position.set(x,y,z);
  this.boundingBox = new THREE.Box3().setFromObject(this.hitbox);
  this.boxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
}
//add characters
function Character(m,model3D,scorePts, x,y,z){

  loader.load(model3D, function(obj){
    obj.position.set(x,y,z);
    ennemiesMeshes[m] = obj;
    scene.add(ennemiesMeshes[m]);
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
  //scene.add(this.boxHelper);
};
//add bullets
function Bullet(index, x,y,z, direction){
  this.scorePts = 20;
  this.alive = false;
  this.index = index;
  this.direction = direction;
  this.dim = 0.30;
  this.hitbox = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff0000}) );
  this.particleOptions = new particleOpt();
  this.particleOptions.position.set(x,y,z);
  this.hitbox.position.set(x,y,z);
  this.boundingBox = new THREE.Box3().setFromObject(this.hitbox);
  this.boxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
  //scene.add(this.boxHelper);
};

function Wall(n, x,y,z, yHit,zHit){
  this.alive = true;
  loader.load("src/medias/models/alphaWall.json", function(obj){
    obj.position.set(x,y,z);
    wallsMeshes[n] = obj;
    wallsMeshes[n].material.alphaMap.wrapT = THREE.RepeatWrapping;
    wallsMeshes[n].material.alphaMap.repeat.y = 1;
    scene.add(wallsMeshes[n]);
  });
  this.dim = 0.9;
  this.hitbox = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff0000}) );
  this.hitbox.position.set(x,yHit,zHit);
  this.boundingBox = new THREE.Box3().setFromObject(this.hitbox);
  this.boxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
  //scene.add(this.boxHelper);

}

function initWalls(nbColumns){
  var n = 0;
  for (var i=0; i<nbColumns; i++){
    walls[n  ] = new Wall(n  , (i*10-20)    , -30, 0  ,   -30, 0);
    walls[n+1] = new Wall(n+1, (i*10-20)-1.0, -30, 0  ,   -31, 0);
    walls[n+2] = new Wall(n+2, (i*10-20)+1.0, -30, 0  ,   -29, 0);
    walls[n+3] = new Wall(n+3, (i*10-20)-0.5, -30, 0+1,   -28, 0);
    walls[n+4] = new Wall(n+4, (i*10-20)+0.5, -30, 0+1,   -27, 0);
    walls[n+5] = new Wall(n+5, (i*10-20)-0.5, -30, 0-1,   -32, 0);
    walls[n+6] = new Wall(n+6, (i*10-20)+0.5, -30, 0-1,   -33, 0);
    n+=7;
  }
}

function initEnnemies(nbColumns,nbLines){
  var n=0;
  for (var j=0; j<nbLines; j++) {
    for (var i=0; i<nbColumns; i++){
      if (n< 2*nbColumns) ennemies[n] = new Character(n,"src/medias/models/spell-book-decimated.json",30, (i*3-10), (j*3+5), 0);
      else if (n< 4*nbColumns) ennemies[n] = new Character(n,"src/medias/models/tome-of-secret-speculation.json",50, (i*3-10), (j*3+5), 0);
      else ennemies[n] = new Character(n,"src/medias/models/damned-souls.json",100, (i*3-10), (j*3+5), 0);
      groupEnnemies.add(ennemies[n].hitbox);
      n++;
    }
  }
};
function initBullets(nbBullet){
  for (var i=0; i<nbBullet; i++){
    bullets[i] = new Bullet(i, -5,0,15, vectNull);
    collisionParticle[i] = new particleOpt();
    collisionParticle[i].lifetime = 3;
    collisionParticle[i].color = 0xffA500; //orange
    collisionParticle[i].positionRandomness = 1;
    collisionParticle[i].position.set(0,-20,10);
    collisionParticle[i].turbulence = 0.3;
    //scene.add(bullets[i].hitbox);
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
  this.explosion = 600;
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
      if (chaseCameraActive) chaseCamera.position.x -= settings.playerMoveSpeed;
    }
  }
  if (rightArrowPushed) {
    if (player.hitbox.position.x < 20){
      player.hitbox.position.x += settings.playerMoveSpeed;
      playerMesh.position.x += settings.playerMoveSpeed;
      if (chaseCameraActive) chaseCamera.position.x += settings.playerMoveSpeed;
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
      microgravity.play();
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
      document.getElementById("info").style.display = "none";
      //glitching=false;
      //microgravity.play();
      //mixer.clipAction(ennemiesMeshes[2].animations[0], ennemiesMeshes[2]).play();
      //switchMenu();
      break;
    case "ArrowUp":
      document.getElementById("info").style.display = "block";
      launch = true;
      //glitching=true;
      //microgravity.play();
      //mixer.clipAction(ennemiesMeshes[2].animations[0], ennemiesMeshes[2]).play();
      //switchMenu();
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
    case "1":
      chaseCameraActive = true;
      chaseCamera.up.set(0,0,1);
      chaseCamera.position.set(playerMesh.position.x,playerMesh.position.y-10,playerMesh.position.z+5);
      //glitching=false;
      break;
    case "2":
      chaseCameraActive = false;
      chaseCamera.position.set(0,-60,10);
      chaseCamera.up.set(0,0,1);
      chaseCamera.lookAt(vectLook);
    break;
    case "3":
      chaseCameraActive = false;
      chaseCamera.position.set(0,35,-10);
      chaseCamera.up.set(0,0,-1);
      chaseCamera.lookAt(vectLook);
      //glitching=true;
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
    case "Escape":
      document.getElementById("speedAnim").style.display = "none";
      break;
    case "s":
      //pause = (pause ? false: true);
      if (pause) {
        document.getElementById("pauseMenu").style.display = "none";
        pause = false;
      } else {
        document.getElementById("pauseMenu").style.display = "block";
        pause = true;
      }
      break;
    case "h":
      if (document.getElementById("help").style.display === "none"){
        document.getElementById("help").style.display = "block";
      } else {
        document.getElementById("help").style.display = "none";
      }
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
    /*if (collisionParticle.position.z <= 1) {
      collisionParticle.position.z += settings.bulletSpeed/100;
    }*/
    if (bullets[i].hitbox.position.y >= yZoneLimit || bullets[i].hitbox.position.y <= -yZoneLimit) { //reset the bullets who goes too far
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
        else if (collisionParticle[i].explosion < 600 && collisionParticle[i].explosion >0){
          particleSystem.spawnParticle( collisionParticle[i] );
          collisionParticle[i].explosion --;
        }
      }
      /*if (collisionParticle.position.z < 1) {
        particleSystem.spawnParticle( collisionParticle );
        //if (tick == 0) collisionParticle.position.set(0,-20,10);
      }*/
    }
  }
  particleSystem.update( tick );
}

function updateBoundingBoxes(){
  player.boundingBox.setFromObject(player.hitbox);
  for (var i=0; i<ennemies.length; i++){
    ennemies[i].boundingBox.setFromObject(ennemies[i].hitbox);
  }
  for (var j=0; j<bullets.length; j++){
      bullets[j].boundingBox.setFromObject(bullets[j].hitbox);
  }
  for (var k=0; k<walls.length; k++){
      walls[k].boundingBox.setFromObject(walls[k].hitbox);
  }
}



function fullDetectCollision(bullet){
  var index = bullet.index;
  if (bullet.hitbox.position.y <= -10){ //collision between bullets and walls
    for (var i = 0; i < walls.length; i++) {
      if (bullet.boundingBox.intersectsBox(walls[i].boundingBox)){
        collisionParticle[index].position.set(walls[i].hitbox.position.x,walls[i].hitbox.position.y,walls[i].hitbox.position.z);
        collisionParticle[index].explosion = 599;
        bullet.alive = false;
        walls[i].alive=false;
        bullet.hitbox.position.setZ(15);
        walls[i].hitbox.position.setZ(10);
        wallsMeshes[i].visible=false;
      }
    }
  }
  if (bullet.direction == vectDown){ //collision between bullets and player
    //computeHitboxEdges(player); //use box3 instead
    //player.boundingBox.setFromObject(player.hitbox);
    //if (isCollision(bullet,player)) { //use box3 instead
    if (bullet.boundingBox.intersectsBox(player.boundingBox)) {
      collisionParticle[index].position.set(player.hitbox.position.x,player.hitbox.position.y,player.hitbox.position.z);
      collisionParticle[index].explosion = 599;
      bullet.alive = false;
      bullet.hitbox.position.setZ(15);
      settings.lifePoints--;
      glitching = true;
      if (settings.lifePoints <= 0) {
        gameOver();
      }
    }
  }
  else {
    for (var i=0; i<ennemies.length; i++){ //collision between bullets and ennemies
      //computeHitboxEdges(ennemies[i]);
      //ennemies[i].boundingBox.setFromObject(ennemies[i].hitbox);
      //if (isCollision(bullet,ennemies[i])) {
      if (bullet.boundingBox.intersectsBox(ennemies[i].boundingBox)) {
        collisionParticle[index].position.set(ennemies[i].hitbox.position.x,ennemies[i].hitbox.position.y,ennemies[i].hitbox.position.z);
        collisionParticle[index].explosion = 599;
        bullet.alive = false;
        bullet.hitbox.position.setZ(15);
        ennemies[i].hitbox.visible = false;
        ennemies[i].hitbox.position.setZ(4);
        ennemies[i].alive = false;
        ennemiesMeshes[i].visible = false;
        score += ennemies[i].scorePts;

      }
    }
    for (var i=0; i<bullets.length; i++){ //collision between bullets
      if (bullets[i].direction == vectDown){
        //computeHitboxEdges(bullets[i]);
        //bullets[i].boundingBox.setFromObject(bullets[i].hitbox);
        //if (isCollision(bullet,bullets[i])){
        if (bullet.boundingBox.intersectsBox(bullets[i].boundingBox)){
          collisionParticle[index].position.set(bullets[i].hitbox.position.x,bullets[i].hitbox.position.y,bullets[i].hitbox.position.z);
          collisionParticle[index].explosion = 599;
          bullet.alive = false;
          bullets[i].hitbox.visible = false;
          bullet.hitbox.position.setZ(5);
          bullets[i].hitbox.position.setZ(18);
          bullets[i].alive = false;
          bullets[i].particleOptions.position.setZ(15);
          score += bullets[i].scorePts;
        }
      }
    }
  }
}

function gameOver(){
  pause=true;
  document.getElementById("info").style.display = "block";
  document.getElementById("info").innerHTML = "Game Over"
}

function isCollision(a, b) { //not used
return	(a.hitbox.minX <= b.hitbox.maxX && a.hitbox.maxX >= b.hitbox.minX) &&
      (a.hitbox.minY <= b.hitbox.maxY && a.hitbox.maxY >= b.hitbox.minY) &&
      (a.hitbox.minZ <= b.hitbox.maxZ && a.hitbox.maxZ >= b.hitbox.minZ)
}

function animaEnnemies(){
  for (var i=0; i<ennemies.length; i++){
    mixers[i] = new THREE.AnimationMixer(scene);
    //window.alert(ennemiesMeshes[i]);
    mixers[i].clipAction(ennemiesMeshes[i].animations[0], ennemiesMeshes[i]).play();
  }
  // TODO player animation to place somewhere else
  playerMixer = new THREE.AnimationMixer(scene);
  playerMixer.clipAction(playerMesh.animations[0], playerMesh).play();
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
        ennemiesMeshes[i].position.x += settings.ennemyMoveSpeed;
        if (ennemies[i].hitbox.position.x > xZoneLimit) {
          ennemies[i].daWae = vectDown;
          ennemies[i].hitbox.position.y -= 2;
          ennemiesMeshes[i].position.y -= 2;
        }
      }
      else if (ennemies[i].daWae == vectDown) {
        ennemies[i].hitbox.position.x -= settings.ennemyMoveSpeed;
        ennemiesMeshes[i].position.x -= settings.ennemyMoveSpeed;
        if (ennemies[i].hitbox.position.x < -xZoneLimit) {
          ennemies[i].daWae = vectUp;
          ennemies[i].hitbox.position.y -= 2;
          ennemiesMeshes[i].position.y -= 2;
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
