/**************************************************
*** SEARCH INPUT CONTROLLER
***
*** Handles user's keyboard input.
*** Valid input are return, ESC, down arrow, and up arrow keys.
***************************************************/

;(function(global) {
  'use strict';

  //Dependencies and Import
  var Models = global.Models = global.Models || {};
  var AjaxHelper = global.AjaxHelper = global.AjaxHelper || {};
  var Map = global.Map = global.Map || {};
  var List = global.List = global.List || {};
  var Clear = global.Clear = global.Clear || {};

  //Export
  var SearchInput = global.SearchInput = global.SearchInput || {};
  SearchInput.clearSearchInputAndMore = clearSearchInputAndMore;
  SearchInput.queryAndDisplayOnUserInput = queryAndDisplayOnUserInput;


  //Clear search input, disable clear icon, clear listed results, 
  //and clear highlighted States on the map
  function clearSearchInputAndMore() {
    var el = document.getElementById("searchInput");
    el.value = "";
    el.focus();
    Clear.disableClearIcon();
    List.clearListedResults();
    Map.clearHighlightedStates();
  }


  //Display search results by showing Listed Results, Highlighting states,
  //and enabling clear icon
  function displaySearchResults(jsonObjArray) {
    var searchResults = Models.createSearchResultsFromJsonArray(jsonObjArray);
    List.showTextSearchResults(searchResults);
    Map.highlightStates(searchResults);
    Clear.enableClearIcon();
  }

  //On user input, query the server and display the matches
  function queryAndDisplayOnUserInput() { 
    var key = document.getElementById("searchInput").value;

    if (key.length >= 1) {
      //Make AJAX Call
      AjaxHelper.getJSONArray(key, 'State', displaySearchResults);
    }
    else {
      List.clearListedResults();
      Map.clearHighlightedStates();
      Clear.disableClearIcon();
    }
  }

  // add event listener to input field
  document.getElementById("searchInput").addEventListener("input", queryAndDisplayOnUserInput, false);

})(this);