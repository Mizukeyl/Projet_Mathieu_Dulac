'use strict';

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
      //animaEnnemies();
      //microgravity.play();

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
      //placeEnnemies();
      break;
    case "ArrowUp":
      document.getElementById("info").style.display = "block";
      launch = true;
      //glitching=true;
      //microgravity.play();
      //mixer.clipAction(ennemiesMeshes[2].animations[0], ennemiesMeshes[2]).play();
      //placeEnnemies();
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
      showBossLife();
      break;
    case "1":
      chaseCameraActive = true;
      chaseCamera.up.set(0,0,1);
      chaseCamera.position.set(0,playerMesh.position.y-12,playerMesh.position.z+5);
      chaseCamera.lookAt(vectLook);
      chaseCamera.position.set(playerMesh.position.x,playerMesh.position.y-12,playerMesh.position.z+5);
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
      break;
    case "i":
      if (invincibility) invincibility = false;
      else invincibility = true;
      break;
    case "k":
      nuke();
      break;
    case "s":
      pauseGame();
      break;
    case "h":
      hotkeys();
        break;
    default:
      return;
  }
  event.preventDefault();
};


function gameOver(){
  var info = document.getElementById("info");
  pause=true;
  info.style.display = "block";
  info.innerHTML = "Game Over";
  var button = document.createElement('div');
  button.setAttribute("class","pauseMenuButton");
  button.setAttribute("onmouseover","this.style.background='gray';");
  button.setAttribute("onmouseout","this.style.background='#E7E5F6';");
  button.setAttribute("onclick","restartGame()");
  button.innerHTML = "<h2>Restart Game</h2>";
  info.appendChild(button);
}
function startGame(){
  document.getElementById('titleScreen').style.display = "none";
  animaEnnemies();
  settings.level = 0;
  showBossLife();
  microgravity.play();
  //pauseGame();
  nextLevel();
}
function restartGame(){
  var n=0, nbColumns = 5;
  document.getElementById('titleScreen').style.display = "block";
  spriteBack.position.set(0,-100,0);
  sprite.position.set(0,250,0);
  cylinder.position.setY(100);
  alphaMesh.position.setY(100);
  boss.alive = false;
  boss.hitbox.position.set(0,100,0);
  bossMesh.position.set(0,100,0);
  boss.lifePoints = 10;
  for (var i=0; i<nbColumns; i++){
    wallsMeshes[n  ].position.set((i*10-20)    , -23, 0);
    wallsMeshes[n+1].position.set((i*10-20)-1.0, -23, 0);
    wallsMeshes[n+2].position.set((i*10-20)+1.0, -23, 0);
    wallsMeshes[n+3].position.set((i*10-20)-0.5, -23, 0+1);
    wallsMeshes[n+4].position.set((i*10-20)+0.5, -23, 0+1);
    wallsMeshes[n+5].position.set((i*10-20)-0.5, -23, 0-1);
    wallsMeshes[n+6].position.set((i*10-20)+0.5, -23, 0-1);
    wallsMeshes[n].visible = true;
    wallsMeshes[n+1].visible = true;
    wallsMeshes[n+2].visible = true;
    wallsMeshes[n+3].visible = true;
    wallsMeshes[n+4].visible = true;
    wallsMeshes[n+5].visible = true;
    wallsMeshes[n+6].visible = true;
    walls[n  ].hitbox.position.set((i*10-20)    , -23, 0);
    walls[n+1].hitbox.position.set((i*10-20)    , -24, 0);
    walls[n+2].hitbox.position.set((i*10-20)    , -22, 0);
    walls[n+3].hitbox.position.set((i*10-20)    , -20, 0);
    walls[n+4].hitbox.position.set((i*10-20)    , -19, 0);
    walls[n+5].hitbox.position.set((i*10-20)    , -25, 0);
    walls[n+6].hitbox.position.set((i*10-20)    , -26, 0);
    n+=7;
  }
}
function pauseGame(){
  //pause = (pause ? false: true);
  if (pause) {
    document.getElementById("pauseMenu").style.display = "none";
    document.getElementById("speedAnim").style.display = "block";
    pause = false;
  } else {
    document.getElementById("pauseMenu").style.display = "block";
    document.getElementById("speedAnim").style.display = "none";
    pause = true;
  }
}
function decreaseLife(){
  var elem = document.getElementById('life');
  elem.removeChild(elem.lastChild);
  settings.lifePoints--;
  if (settings.lifePoints <= 0) {
    gameOver();
  }
}
function resetLife(){
  var elem = document.getElementById('life');
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
    for (var i=0; i<settings.lifePoints; i++){
      var img = document.createElement("img");
      img.setAttribute("src", "src/medias/images/heart.png");
      img.setAttribute("alt", "Heart");
      document.getElementById("life").appendChild(img);
    }
}
function showBossLife(){
  var elem = document.getElementById('bossLife');
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
  if (settings.level == 3 ){
    for (var i=0; i<boss.lifePoints; i++){
      var img = document.createElement("img");
      img.setAttribute("src", "src/medias/images/bossLife.png");
      img.setAttribute("alt", "Heart");
      document.getElementById("bossLife").appendChild(img);
    }
    if (boss.lifePoints >0){
      var name = document.createElement("div");
      name.innerHTML = "Boss";
      document.getElementById("bossLife").appendChild(name);
    }
  }
}

function muteMusic(){
  console.log("muting :"+document.getElementById('muteMusic').style.color);
  if (!isMusicMuted){
    fate.setVolume(0.0);
    dejavu.setVolume(0.0);
    microgravity.setVolume(0.0);
    document.getElementById('muteMusic').style.color = "#4F3AF9";
    isMusicMuted = true;
    console.log("muted");
  } else {
    console.log("unmuted");
    fate.setVolume(1.0);
    dejavu.setVolume(1.0);
    microgravity.setVolume(0.2);
    document.getElementById('muteMusic').style.color = "#424242";
    isMusicMuted = false;
  }
}
function hotkeys(){
  if (document.getElementById("help").style.display === "block"){
    document.getElementById("help").style.display = "none";
    document.getElementById('hotkeys').style.color = "#424242";
  } else {
    document.getElementById("help").style.display = "block";
    document.getElementById('hotkeys').style.color = "#4F3AF9";
  }
}
function cameraControl(){
  if (controls.enabled) {
    controls.enabled=false;
    document.getElementById('cameraControl').style.color = "#424242";
  }
  else {
    controls.enabled=true;
    document.getElementById('cameraControl').style.color = "#4F3AF9";
  }
}
function guiHide(){
  if (document.getElementById('guiContainer').style.display == "block"){
    document.getElementById('guiContainer').style.display = "none";
    document.getElementById('guiHide').style.color = "#424242";
  }
  else {
    document.getElementById('guiContainer').style.display = "block";
    document.getElementById('guiHide').style.color = "#4F3AF9";
  }
}
