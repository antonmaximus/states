/**************************************************
*** INFORMATION CONTROLLER
***
*** Updates the Information displayed on the HTML.
***************************************************/

;(function(global) {
  'use strict';

  //Export
  var Info = global.Info = global.Info || {};
  Info.updateInfo = updateInfo;


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

})(this);