/**************************************************
************* Clear Option Controller *************
***************************************************/

;(function(global) {
  'use strict';

  //Dependencies and Imports
  var List = global.List = global.List || {};
  var SearchInput = global.SearchInput = global.SearchInput || {};

  //Make the following local functions accessible outside the closure
  var Clear = global.Clear = global.Clear || {};
  Clear.enableClearIcon = enableClearIcon;
  Clear.disableClearIcon = disableClearIcon;


  function toggleClass(el) {
    el.className = el.className=='clearIconOff' ? 'clearIconOn' : 'clearIconOff';

    // if (el) {
    //   el.className = "clearIconOn";
    // } else {
    //   el = document.querySelector("div.clearIconOn");
    //   el.className = "clearIconOff";
    // }
  }

  function enableClearIcon() {
    var el = document.querySelector("div.clearIconOff");

    if (el) {
      toggleClass(el);
    }
  }

  function disableClearIcon() {
    var el = document.querySelector("div.clearIconOn");

    if (el) {
      toggleClass(el);
    }
  }

  function clearInput() {
    SearchInput.clearSearchInputAndMore();
  }

  function clearInputOnEnter(e) {
    if (e.keyCode == '13') {
      clearInput();
    }
  }

  document.getElementById("clearIcon").addEventListener("click", clearInput, false);
  document.getElementById("clearIcon").addEventListener("keydown", clearInputOnEnter, false);

})(this);

