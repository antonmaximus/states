/*------------------------------------*\
    This updates the HTML elements on the information section
\*------------------------------------*/

;(function(global) {
  'use strict';

  //Make the following local functions accessible outside the closure
  var Info = global.Info = global.Info || {};
  Info.updateInfo = updateInfo;
  Info.getJSONArray = getJSONArray;


  //Update the html elements
  function updateInfo (state) {
    //Update only if info is not displayed
    if (document.getElementById("stateName").innerHTML != state.stateName) {
      document.getElementById("stateName").innerHTML = state.stateName
      
      var li = document.getElementById("stateInfo").children;
      li[0].lastElementChild.innerHTML = state.nickname;
      li[1].lastElementChild.innerHTML = state.capital;
      li[2].lastElementChild.innerHTML = state.area_sqmi;
      li[3].lastElementChild.innerHTML = state.population;

      var imgFlag = document.getElementById("flag"); 
      imgFlag.src = state.flag;
      imgFlag.alt = state.stateName;
      imgFlag.title = state.stateName;
    }
  }

  

  // AJAX
function getJSONArray(key, field, callback) {
  var parameters = "?input=" + key + "&field=" + field + "&t=" + Math.random(),
      path = "./php/serverSideParser.php",
      xhr = new XMLHttpRequest(),
      jsonObj;

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) { //success
        jsonObj = JSON.parse(xhr.responseText);
        callback(jsonObj);
      } else {
        console.error(xhr);
      }
    }
  };
  xhr.open("GET", path + parameters, true);
  xhr.send();
}


})(this);