
'use strict';

function loaderRess(text, points){
  //onLoad="document.body.removeChild(document.getElementById('loaderRess'));"
    if(document.getElementById('loaderRess')){
        points = (points ? points : 0);
        points += 1; //(points+1 > 7 ? 0 : points+1);
        if(!text){
            text = document.getElementById('loaderRess').childNodes[0].innerHTML;
        }
        switch (points) {
          case 1:
            text = "Please wait while loading.";
            break;
          case 2:
            text += ".";
            break;
          case 3:
            text += ".";
            break;
          case 4:
            text = "It seems you have a slow connection";
            break;
          case 5:
            text = "You can play this minigame while loading";
            break;
          case 6:
            text = "The loading will continue in the background";
            break;
          default:
        }
      //  if (points == 2) text = "It seems you have a bad connection";
      //  if (points == 3) text = "You can play this minigame until the end of the loading";
        var text_suspensions = text;
      //  for(i=0; i<points; i++){
      //      text_suspensions += '.';
      //  }
        document.getElementById('loaderRess').childNodes[0].innerHTML = text_suspensions;
        if (points<7) {
          setTimeout('loaderRess(\''+text+'\', '+points+')', 2000);
        }
        else {
          document.body.removeChild(document.getElementById('loaderRess'));
        }
    }
}
