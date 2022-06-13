
  function myFunction() 
  {
      var x = document.getElementById("myTopnav");
      var element = document.getElementById("ham");


      if (x.className === "topnav") {
          x.className += " responsive";
          element.className += " active";
      } else 
      {
        element.className = "hamburger";
        x.className = "topnav";      
      }
  }

  //Function add ID to url from what User picked for category
function getIdFromUrl(obj)
{
    if(obj === "home") {
        location.href = window.location.origin +"/~s82088/index.html";
    } else if (obj === "highscores") {
        location.href = window.location.origin +"/~s82088/highscores.html";
    } else {
        location.href ="";
        location.href = window.location.origin +"/~s82088/game.html?id=" + obj;
        //window.alert(url += "?id=" + obj);
    }
}