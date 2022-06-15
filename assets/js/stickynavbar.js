


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
    //fixes problem that href works on WebServer (where first Path is /~s82088/)
    //but not on localHost anymore
    const firstPath = location.pathname.split('/')[1];
    if(obj === "home") {
        location.href = window.location.origin+"/"+firstPath+"/index.html";
    } else if (obj === "highscores") {
        location.href = window.location.origin +"/"+firstPath +"/highscores.html";
    } else {
        location.href ="";
        location.href = window.location.origin +"/"+firstPath +"/game.html?id=" + obj;
    }
}