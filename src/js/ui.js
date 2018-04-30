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
      resetLife();
      break;
    case "1":
      chaseCameraActive = true;
      chaseCamera.up.set(0,0,1);
      chaseCamera.position.set(playerMesh.position.x,playerMesh.position.y-10,playerMesh.position.z+5);
      chaseCamera.lookAt(vectLook);
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
  pause=true;
  document.getElementById("info").style.display = "block";
  document.getElementById("info").innerHTML = "Game Over"
}
function startGame(){
  document.getElementById('titleScreen').style.display = "none";
  settings.level = 0;
  microgravity.play();
  pauseGame();
  nextLevel();
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
  console.log("healing");
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
  //if (elem.childElementCount === 0){
    for (var i=0; i<settings.lifePoints; i++){
      var img = document.createElement("img");
      img.setAttribute("src", "src/medias/images/heart.gif");
      img.setAttribute("alt", "Heart");
      document.getElementById("life").appendChild(img);
    }
  //}
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
