//DAT.GUI

//MODELES 3D SKETCHFAB
function initGui(){

  var folder1 = gui.addFolder( 'Player' );
  var folder2 = gui.addFolder( 'Enemy' );
  var folder3 = gui.addFolder( 'Miscellaneous' );
  var folder4 = gui.addFolder( 'Camera');

  folder1.add(settings, "playerMoveSpeed", 0, 2).step(0.1);
  folder1.add(settings, "lifePoints", 0, 100).step(1).listen().onFinishChange(function(){resetLife();});
  folder1.add(settings, "reloadDelay", 0, 2).step(0.05);
  folder2.add(settings, "enemyMoveSpeed", 0, 2).step(0.1);
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
    placeEnemies();
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
  bossOptions = new particleOpt(); //to test with dat.gui
  bossOptions.positionRandomness = 3;
  bossOptions.lifetime = 3.5;
  bossOptions.color = 0x4220A9;
  bossOptions.turbulence = 0.4;
  bossOptions.velocityRandomness = .4;
  bossOptions.size = 20;
  bossOptions.sizeRandomness = 8;
  particleSystem = new THREE.GPUParticleSystem( {maxParticles: 250000} );
  initBullets(50);
  initEnemies(nbColumns,nbLines);
  player = new PlayerCharacter(0,-35,0);
  boss = new BossCharacter(0, 100, 0);
  initWalls(5);
  //scene.add( groupEnemies ); //hitbox
  //scene.add( player.hitbox );
  //scene.add(player.boxHelper);
  scene.add(particleSystem);
};
//////////////////////////////////////////////////////////////////////////////////
//		Particles
//////////////////////////////////////////////////////////////////////////////////
// Particles options passed during each spawned
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


//////////////////////////////////////////////////////////////////////////////////
//		functions
//////////////////////////////////////////////////////////////////////////////////

function nextLevel(){
  var elem = document.getElementById('info');
  switch (settings.level) {
    case 0:
      //pause = true;
      elem.innerHTML = "Loading 25%";
      elem.style.display = "block";
      moveScene = 50;
      setTimeout(function(){
        document.getElementById('info').style.display = "none";
        positionLevel1();
        scene.fog.color.set(0x21f0d6);
        if (fate.isPlaying) fate.stop();
        if (dejavu.isPlaying) dejavu.stop();
        microgravity.play();
        explosionSfx.setVolume(0.1);
        explosionSfx2.setVolume(0.1);
        explosionSfx3.setVolume(0.1);
        settings.level = 1;
        xZoneLimit = 22;
        settings.shootFrequ = 800;
        settings.enemyMoveSpeed = 0.08;
        score = 0;
        settings.lifePoints = 3;
        resetLife();
        pause = false;
      }, 2500);
      break;
    case 1:
      elem.innerHTML = "Loading 50%";
      elem.style.display = "block";
      moveScene = 50;
      setTimeout(function(){
        document.getElementById('info').style.display = "none";
        positionLevel2();
        scene.fog.color.set(0xB60044);
        microgravity.stop();
        dejavu.play();
        settings.level = 2;
        settings.shootFrequ = 400;
        settings.enemyMoveSpeed = 0.1;
      }, 2500);
      break;
    case 2:
      elem.innerHTML = "Loading 75%";
      elem.style.display = "block";
      moveScene = 50;
      boss.emitParticles = true;
      bossOptions.explosion = 4800;
      setTimeout(function(){
        document.getElementById('info').style.display = "none";
        positionLevel3();
        dejavu.stop();
        fate.play();
        scene.fog.color.set(0xaaaaaa);
        settings.level = 3;
        showBossLife();
        xZoneLimit = 20;
      }, 2500);
      break;
    case 3:
      elem.innerHTML = "Loading 99%";
      elem.style.display = "block";
      moveScene = 180;
      setTimeout(function(){
        document.getElementById('info').style.display = "none";
        document.getElementById('endingScreen').style.display = "block";
        explosionSfx.play();
        explosionSfx2.play();
        explosionSfx3.play();
        explosionSfx.setVolume(1);
        explosionSfx2.setVolume(1);
        explosionSfx3.setVolume(1);
        settings.level = 4;//game end
        setTimeout(function(){
          document.getElementById('endingScreen').style.display = "none";
          gameOver(" You Won with a score of : " + score + " points !");
          //elem.style.display = "block";
          //elem.innerHTML = " You Won with a score of : " + score + " points !";
        }, 2000);
      }, 2000);
      break;
    default:
      console.log('next Level incorrect');
  }
}
function positionLevel1(){
  var n=0, i=0, j=0;
  for (var j=0; j< 5; j++) {
    for (var i=0; i< 8; i++){
      enemies[n].hitbox.position.set(i*3-10, j*3+5, 0);
      enemiesMeshes[n].position.set(i*3-10, j*3+5, 0);
      enemies[n].daWae = vectUp;
      enemies[n].alive = true;
      enemies[n].hitbox.visible = true;
      enemiesMeshes[n].visible = true;
      n++;
    }
  }
  remainingEn = enemies.length;
}
function positionLevel2(){
  var n=0, i=0, j=0, k=0, p=3;
  for (var j=0; j< 5; j++) {
    k=0; p=0;
    for (var i=0; i< 8; i++){
      if (i>3) {
        k=5;
        if (i>4) p += 3;
      } else {
        p -= 3;
      }
      enemies[n].hitbox.position.set(i*3-10 + k, j*3+10 + p, 0);
      enemiesMeshes[n].position.set(i*3-10 + k, j*3+10 + p, 0);
      enemies[n].daWae = vectUp;
      enemies[n].alive = true;
      enemies[n].hitbox.visible = true;
      enemiesMeshes[n].visible = true;
      n++;
    }
  }
  remainingEn = enemies.length;
}
function positionLevel3(){
  boss.hitbox.position.set(0,0,0);
  bossMesh.position.set(0,0,0);
  boss.alive = true;
  bossMesh.visible = true;

  remainingEn = enemies.length;
}
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
  this.dim = 1.7;
  this.alive = true;
  this.daWae = vectUp; //the way of the movement
  this.hitbox = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  this.hitbox.position.set(x,y,z);
  this.boundingBox = new THREE.Box3().setFromObject(this.hitbox);
  this.boxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
  //scene.add(this.boxHelper);

  //playerMesh = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  //playerMesh.position.set(x,y,z);
  //scene.add(playerMesh);

}
function BossCharacter(x,y,z){
  loader.load("src/medias/models/eden-book.json", function(obj){
    obj.position.set(x,y,z);
    obj.scale.set(2,2,2);
    bossMesh = obj;
    scene.add(bossMesh);
  });
  this.scorePts = 500;
  this.dim = 2.8;
  this.lifePoints = 10;
  this.emitParticles = false;
  this.alive = false;
  this.daWae = vectDown; //the way of the movement
  this.hitbox = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  this.hitbox.position.set(x,y,z);
  this.boundingBox = new THREE.Box3().setFromObject(this.hitbox);
  this.boxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
  //scene.add(this.boxHelper);

  //bossMesh = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  //bossMesh.position.set(x,y,z);
  //scene.add(bossMesh);

}
//add characters
function Character(m,model3D,scorePts, x,y,z){

  loader.load(model3D, function(obj){
    obj.position.set(x,y,z);
    enemiesMeshes[m] = obj;
    scene.add(enemiesMeshes[m]);
    //m++;
  });
  this.scorePts = scorePts;
  this.dim = 1;
  this.alive = false;
  this.daWae = vectUp; //the way of the movement
  this.hitbox = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  this.hitbox.position.set(x,y,z);
  this.boundingBox = new THREE.Box3().setFromObject(this.hitbox);
  this.boxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
  //scene.add(this.boxHelper);

  //var obj = new THREE.Mesh(new THREE.BoxGeometry( this.dim, this.dim, this.dim ), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  //obj.position.set(x,y,z);
  //enemiesMeshes[m] = obj;
  //scene.add(enemiesMeshes[m]);

};
//add bullets
function Bullet(index, x,y,z, direction){
  this.scorePts = 15;
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
    walls[n  ] = new Wall(n  , (i*10-20)    , -23, 0  ,   -23, 0);
    walls[n+1] = new Wall(n+1, (i*10-20)-1.0, -23, 0  ,   -24, 0);
    walls[n+2] = new Wall(n+2, (i*10-20)+1.0, -23, 0  ,   -22, 0);
    walls[n+3] = new Wall(n+3, (i*10-20)-0.5, -23, 0+1,   -20, 0);
    walls[n+4] = new Wall(n+4, (i*10-20)+0.5, -23, 0+1,   -19, 0);
    walls[n+5] = new Wall(n+5, (i*10-20)-0.5, -23, 0-1,   -25, 0);
    walls[n+6] = new Wall(n+6, (i*10-20)+0.5, -23, 0-1,   -26, 0);
    n+=7;
  }
}

function initEnemies(nbColumns,nbLines){
  var n=0;
  for (var j=0; j<nbLines; j++) {
    for (var i=0; i<nbColumns; i++){
      if (n< 2*nbColumns) enemies[n] = new Character(n,"src/medias/models/spell-book-decimated.json",30, (i*3-10), (j*3+5), 0);
      else if (n< 4*nbColumns) enemies[n] = new Character(n,"src/medias/models/tome-of-secret-speculation.json",50, (i*3-10), (j*3+5), 0);
      else enemies[n] = new Character(n,"src/medias/models/damned-souls.json",100, (i*3-10), (j*3+5), 0);
      groupEnemies.add(enemies[n].hitbox);
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
      //if (shootEffect3.isPlaying) shootEffect.play();
      //else shootEffect3.play();
      shootAudio();
      lastShot = clockShoot.getElapsedTime();
    }
  }
};

//manage bullets movements and particles
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
    bullets[i].boundingBox.setFromObject(bullets[i].hitbox);
    fullDetectCollision(bullets[i]);
    if (bullets[i].hitbox.position.y >= yZoneLimit || bullets[i].hitbox.position.y <= -yZoneLimit) { //reset the bullets who goes too far
      bullets[i].alive = false;
      bullets[i].hitbox.position.setZ(20);
      bullets[i].particleOptions.position.setZ(15);
    }
  }

}



function updateBoundingBoxes(){
  player.boundingBox.setFromObject(player.hitbox);
  boss.boundingBox.setFromObject(boss.hitbox);
  for (var i=0; i<enemies.length; i++){
    enemies[i].boundingBox.setFromObject(enemies[i].hitbox);
  }
  for (var j=0; j<bullets.length; j++){
      bullets[j].boundingBox.setFromObject(bullets[j].hitbox);
  }
  for (var k=0; k<walls.length; k++){
      walls[k].boundingBox.setFromObject(walls[k].hitbox);
  }
}


//detect collision between two hitboxes and end of the level
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
        explosionAudio();
      }
    }
  }
  if (bullet.direction == vectDown){ //collision between bullets and player
    if (bullet.boundingBox.intersectsBox(player.boundingBox)) {
      collisionParticle[index].position.set(player.hitbox.position.x,player.hitbox.position.y,player.hitbox.position.z);
      collisionParticle[index].explosion = 599;
      bullet.alive = false;
      bullet.hitbox.position.setZ(15);
      if (!invincibility) {
        glitching = true;
        decreaseLife();
      }
      explosionAudio();
    }
  }
  else {
    for (var i=0; i<enemies.length; i++){ //collision between bullets and enemies
      if (bullet.boundingBox.intersectsBox(enemies[i].boundingBox)) {
        collisionParticle[index].position.set(enemies[i].hitbox.position.x,enemies[i].hitbox.position.y,enemies[i].hitbox.position.z);
        collisionParticle[index].explosion = 599;
        bullet.alive = false;
        bullet.hitbox.position.setZ(15);
        enemies[i].hitbox.visible = false;
        enemies[i].hitbox.position.setZ(4);
        enemies[i].alive = false;
        enemiesMeshes[i].visible = false;
        score += enemies[i].scorePts;
        remainingEn --;
        explosionAudio();
      }
    }
    if (bullet.boundingBox.intersectsBox(boss.boundingBox)) {//collision with boss
      boss.lifePoints --;
      //collisionParticle[index].position.set(boss.hitbox.position.x,boss.hitbox.position.y,boss.hitbox.position.z);
      //collisionParticle[index].explosion = 599;
      bossOptions.explosion = 599;
      explosionAudio();
      bullet.alive = false;
      bullet.hitbox.position.setZ(15);
      if (boss.lifePoints == 0){
        boss.hitbox.visible = false;
        boss.hitbox.position.setZ(4);
        boss.alive = false;
        bossMesh.visible = false;
        score += boss.scorePts;
        //remainingEn = 0;
        nuke();
      } else {
        //spawnEnemy(boss.hitbox.position.x,boss.hitbox.position.y-3,boss.hitbox.position.z, vectDown);
        //spawnEnemy(boss.hitbox.position.x+3,boss.hitbox.position.y-3,boss.hitbox.position.z, vectDown);
        spawnEnemies(boss.hitbox.position.x,boss.hitbox.position.y,boss.hitbox.position.z);
      }
      showBossLife();
    }
    for (var i=0; i<bullets.length; i++){ //collision between bullets
      if (bullets[i].direction == vectDown){
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
          explosionAudio();
        }
      }
    }

  }
}

function spawnEnemy(x,y,z, direction){
  var i=0, spawn = false;
  while ((i<enemies.length) && !spawn){
    console.log('bloqué'+ i + spawn);
    if (enemies[i].alive == false) {
      enemies[i].hitbox.position.set(x,y,z);
      enemiesMeshes[i].position.set(x,y,z);
      enemies[i].daWae = direction;
      enemies[i].alive = true;
      enemies[i].hitbox.visible = true;
      enemiesMeshes[i].visible = true;
      spawn = true;
    }
    i++;
  }
}
function spawnEnemies(x,y,z){
  spawnEnemy(x+3,y-2,z, vectUp);
  spawnEnemy(x+3,y-4,z, vectDown);
  spawnEnemy(x-3,y-2,z, vectUp);
  spawnEnemy(x-3,y-4,z, vectDown);

}
function explosionAudio(){
  if (!explosionSfx2.isPlaying) explosionSfx2.play();
  else if (!explosionSfx.isPlaying) explosionSfx.play();
  else if (!explosionSfx3.isPlaying) explosionSfx3.play();
  else {
    explosionSfx2.stop();
    explosionSfx2.play();
  }
}
function shootAudio(){
  if (!shootSfx.isPlaying) shootSfx.play();
  else if (!shootSfx2.isPlaying) shootSfx2.play();
  else if (!shootSfx3.isPlaying) shootSfx3.play();
  else {
    shootSfx.stop();
    shootSfx.play();
  }
}

function isCollision(a, b) { //not used
return	(a.hitbox.minX <= b.hitbox.maxX && a.hitbox.maxX >= b.hitbox.minX) &&
      (a.hitbox.minY <= b.hitbox.maxY && a.hitbox.maxY >= b.hitbox.minY) &&
      (a.hitbox.minZ <= b.hitbox.maxZ && a.hitbox.maxZ >= b.hitbox.minZ)
}

function animaEnemies(){
  for (var i=0; i<enemies.length; i++){
    mixers[i] = new THREE.AnimationMixer(scene);
    //window.alert(enemiesMeshes[i]);
    mixers[i].clipAction(enemiesMeshes[i].animations[0], enemiesMeshes[i]).play();
  }
  // TODO player animation to place somewhere else
  playerMixer = new THREE.AnimationMixer(scene);
  bossMixer = new THREE.AnimationMixer(scene);
  playerMixer.clipAction(playerMesh.animations[0], playerMesh).play();
  bossMixer.clipAction(bossMesh.animations[0], bossMesh).play();
}

function bossMove(){
  if (settings.level == 3){
    var missDirection = false;
    if (boss.alive){
      //gameOver if the boss arrives to the walls
      if(boss.hitbox.position.y <= walls[0].hitbox.position.y){
        gameOver("Game Over<br/> you lost because the enemy pierced your barricades<br/>");
      }
      //probability of shooting
      if (Math.floor(Math.random()*settings.shootFrequ/2) == 0) bomb(vectDown,boss.hitbox.position);
      //probability of changing direction
      if (Math.floor(Math.random()*800) == 0) missDirection = true;
      //movements
      if (boss.daWae == vectUp) {
        boss.hitbox.position.x += settings.enemyMoveSpeed;
        bossMesh.position.x += settings.enemyMoveSpeed;
        if ((boss.hitbox.position.x > (xZoneLimit-5)) || missDirection) boss.daWae = vectDown;
      } else {
        boss.hitbox.position.x -= settings.enemyMoveSpeed;
        bossMesh.position.x -= settings.enemyMoveSpeed;
        if ((boss.hitbox.position.x < (-xZoneLimit+5)) || missDirection) boss.daWae = vectUp;
      }
    }
  }
}
//AI of the enemies
function enemiesMove(){
  for (var i=0; i<enemies.length; i++){
    if (enemies[i].alive){//enemy is alive
      //game over if enemies arrives to the walls
      if(enemies[i].hitbox.position.y <= walls[0].hitbox.position.y){
        gameOver("Game Over<br/> you lost because the enemy pierced your barricades<br/>");

      }
      //probability of shooting
      if (Math.floor(Math.random()*settings.shootFrequ) == 0) {shoot(vectDown,enemies[i].hitbox.position)}
      //enemies movements
      if (enemies[i].daWae == vectUp) {
        enemies[i].hitbox.position.x += settings.enemyMoveSpeed;
        enemiesMeshes[i].position.x += settings.enemyMoveSpeed;
        if (enemies[i].hitbox.position.x > xZoneLimit) {
          enemies[i].daWae = vectDown;
          if (!invincibility) {
            enemies[i].hitbox.position.y -= 3;
            enemiesMeshes[i].position.y -= 3;
          }
        }
      }
      else if (enemies[i].daWae == vectDown) {
        enemies[i].hitbox.position.x -= settings.enemyMoveSpeed;
        enemiesMeshes[i].position.x -= settings.enemyMoveSpeed;
        if (enemies[i].hitbox.position.x < -xZoneLimit) {
          enemies[i].daWae = vectUp;
          if (!invincibility){
            enemies[i].hitbox.position.y -= 3;
            enemiesMeshes[i].position.y -= 3;
          }
        }
      }
    }
  }
}
function particlesGenerator (){
  var delta = clock.getDelta() * spawnerOptions.timeScale;
  tick += delta;
  if ( tick < 0 ) tick = 0;
  if ( delta > 0 ) {
    for ( var x = 0; x < spawnerOptions.spawnRate * delta; x++ ) {
      //bullet's particles
      for (var i=0; i<bullets.length;i++){
        if (bullets[i].alive){
          particleSystem.spawnParticle( bullets[i].particleOptions );
        }
        else if (collisionParticle[i].explosion < 600 && collisionParticle[i].explosion >0){
          particleSystem.spawnParticle( collisionParticle[i] );
          collisionParticle[i].explosion --;
        }
      }
      //boss particles
      if (boss.emitParticles && bossOptions.explosion >0){
        bossOptions.position.set(boss.hitbox.position.x,boss.hitbox.position.y,boss.hitbox.position.z);
        particleSystem.spawnParticle( bossOptions );
        bossOptions.explosion--;
      }
    }
  }
  particleSystem.update( tick );
}
//summon a bullet at the position
//take the first bullet that isn't moving into the battlefield
//if no bullet are available, it will reset all the bullets (should not happen if the bullets array is large enought)
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
    }
  }
  bullets[j].direction = direction;
  bullets[j].hitbox.position.set(
    position.x,
    position.y,
    position.z);
  bullets[j].hitbox.visible = true;
  bullets[j].alive = true;
}

function bomb(direction,position){
  var vectPos = new THREE.Vector3(position.x,position.y,position.z);
  //vectPos.set(player.hitbox.position.x,player.hitbox.position.y,player.hitbox.position.z);
  vectPos.x -= 4;
  for (var i=0; i<3; i++){
    vectPos.x += 2;
    vectPos.y += (Math.random()*-1);
    shoot(direction, vectPos);
  }
}

function nuke(){
  var vectPos = new THREE.Vector3(0,0,0);
  var oldScore = score;
  for (var i=0; i<enemies.length; i++){
    vectPos.set(enemies[i].hitbox.position.x,
                enemies[i].hitbox.position.y-1,
                enemies[i].hitbox.position.z,
    );
    shoot(vectUp, vectPos);
  }
  if (settings.level == 3){
    boss.lifePoints = 0;
    boss.alive = false;
    bossMesh.visible = false;
    boss.hitbox.position.setZ(4);

  }
  setTimeout(function(){
    score = oldScore;
  }, 100);
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
