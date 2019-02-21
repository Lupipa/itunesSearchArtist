var searchButton = document.getElementById("btn-search");//button --> Search artist songs
var favButton = document.getElementById("btn-favsSong");//button --> list of favorite songs
var artist = null;//input --> artist name
var id = null; //buttons ID
var aux = null;//html > song card
var heartButtons = null;//save all song buttons
var songContainer = null;//songs
var heartIcon = null;//save icon name (HEART/HEART-OUTLINE)
var favSongList = [];//save favourite songs >> UPGRADE -> Put it in a database.

var results = document.getElementById("results");//attach song cards
//Split name -> 'space'
//EVENT LISTENERS----------------------------------------------------------------
searchButton.addEventListener("click", searchArtist);
favButton.addEventListener("click", favList);
//FUNCTIONS ----------------------------------------------------------------------
//Show Artist songs
//Search artist data:
function searchArtist(){
  artist = document.getElementById("search");
  id = 0;
  var aux4 = null;//boolean
  $.ajax({
      url: 'https://itunes.apple.com/search',
      crossDomain: true,
      dataType: 'jsonp',
      data: {
        term: artist.value,
        entity: 'song',
        limit: 30,
        explicit: 'No'
      },
      method: 'GET',
      success: function(data){
        console.log(data);

        results.innerHTML ="";//clear search

        $.each(data.results,function(i,result){
          if ( i > 23 ) { return false; }
          var hires = result.artworkUrl100.replace('100x100','480x480');
          aux='<div class="card-container"><img src="'+hires+'" onerror="src='+result.artworkUrl100+'" /> <div class="card"><h2>'+result.trackName+'</h2><p>'+result.collectionCensoredName+'</p></div><div><button id='+id+' class="heartButton">';
          //Put correct icon button --> fav song (heart) | no fav song (heart-outline)
          if(favSongList.length > 0){
            aux4 = true;
            for(var i=0; i<favSongList.length; i++){
              if(favSongList[i].querySelector(".card").querySelector("h2").textContent == result.trackName){
                aux+='<img src="icon/heart.png"/></button></div></div>';
                aux4 = false;
              }
            }
            if(aux4){
              aux+='<img src="icon/heart-outline.png"/></button></div></div>';
            }
          }
          else{
            aux='<div class="card-container"><img src="'+hires+'" onerror="src='+result.artworkUrl100+'" /> <div class="card"><h2>'+result.trackName+'</h2><p>'+result.collectionCensoredName+'</p></div><div><button id='+id+' class="heartButton"><img src="icon/heart-outline.png"/></button></div></div>';
          }
          results.innerHTML+=aux;
          id++;
        });
        addSongsToFav(false);//fill var 'favSongList'
      },
      error: function(e){
        console.log(e);
      }
    }); 
}
//Add songs to fav list
function addSongsToFav(searchFav){
  var aux3 = true;//boolean
  songContainer = document.getElementById("results").querySelectorAll(".card-container");
  //Select all song buttons
  heartButtons = document.getElementById("results").querySelectorAll("button");
  heartButtons.forEach(function(button,index){
    button.addEventListener("click", function(){
      heartIcon = button.querySelector("img").src.split("/");//take the icon name
      if(heartIcon[heartIcon.length-1] == "heart.png"){
        for(var i=0; i<favSongList.length; i++){
          if(favSongList[i].outerHTML == songContainer[index].outerHTML){
            if(searchFav){
              var songId = songContainer[index].querySelector("button").id;//search song id
              document.getElementById(songId).parentNode.parentNode.remove();//remove from DOM
            }
            favSongList.splice(i,1);//remove song from fav list
          }
        } 
        button.querySelector("img").src="icon/heart-outline.png";
      }else{
        button.querySelector("img").src="icon/heart.png";
        if(favSongList.length > 0){
          for(var i=0; i<favSongList.length; i++){
            if(favSongList[i].outerHTML == songContainer[index].outerHTML){
              aux3 = false;
            }
          }
          if(aux3){
            favSongList.push(songContainer[index]);
          }
        }
        else{
          favSongList.push(songContainer[index]);
        }
      }
      });
  });
}
//List of favourite songs:
function favList(){
  results.innerHTML ="";//Clear song list
  for(var i=0; i<favSongList.length; i++){
    results.innerHTML +=favSongList[i].outerHTML;
  }  
  addSongsToFav(true);
}
