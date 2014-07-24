/**************************************************
*** CLEAR ICON CONTROLLER
***
*** Display/Undisplay clear 'x' icon on Search Input.
***************************************************/

;(function(global) {
  'use strict';
  //Dependencies and Imports
  var List = global.List = global.List || {};
  var SearchInput = global.SearchInput = global.SearchInput || {};

  //Export
  var Clear = global.Clear = global.Clear || {};
  Clear.enableClearIcon = enableClearIcon;
  Clear.disableClearIcon = disableClearIcon;

  //Toggle class. The transition property on CSS takes over when switching.
  function toggleClass(el) {
    el.className = el.className=='clearIconOff' ? 'clearIconOn' : 'clearIconOff';
  }

  function enableClearIcon() {
    var el = document.querySelector("div.clearIconOff");
    if (el) { //This will fail if null.
      toggleClass(el);
    }
  }

  function disableClearIcon() {
    var el = document.querySelector("div.clearIconOn");
    if (el) { //This will fail if null.
      toggleClass(el);
    }
  }

  //Clear everything.
  function clearInput() {
    SearchInput.clearSearchInputAndMore();
  }

  //Clear only if user hit enter while focus is on 'x' icon.
  function clearInputOnEnter(e) {
    if (e.keyCode == '13') {
      clearInput();
    }
  }

  document.getElementById("clearIcon").addEventListener("click", clearInput, false);
  document.getElementById("clearIcon").addEventListener("keydown", clearInputOnEnter, false);

})(this);

