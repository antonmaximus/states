;(function(global) {
'use strict';

  //Dependencies and Import
  var Models = global.Models = global.Models || {};
  var Info = global.Info = global.Info || {};
  var Map = global.Map = global.Map || {};
  var List = global.List = global.List || {};
  var Clear = global.Clear = global.Clear || {};

  //Make the following local functions accessible outside the closure
  var SearchInput = global.SearchInput = global.SearchInput || {};
  SearchInput.clearSearchInputAndMore = clearSearchInputAndMore;
  SearchInput.queryMatching = queryMatching;


/**************************************************
*** Text Search Results Controller *************
***************************************************/
function clearSearchInputAndMore() {
  var el = document.getElementById("searchInput");
  el.value = "";
  el.focus();
  Clear.disableClearIcon();
  List.clearListedResults();
  Map.clearHighlightedStates();
}

// Handle clicked item from the results li list
function mouseClickHandler(e) {
  clearSearchInputAndMore();
  List.selectStateFromList(e.target.innerHTML);
}
//Handle mouse hover on highlighted items set by keyboard
function removeOrigHighlightOnHoverHandler() {
  var highlighted = document.getElementById('highlighted');
  if (highlighted !== null) {
    highlighted.removeAttribute("id");
  }
}


function createElementWithDependencies (key, stateObj) {
  var li = document.createElement("li");
  li.innerHTML = stateObj.addHTMLEmphasis(key);
  li.addEventListener("click", mouseClickHandler, false);
  li.addEventListener("mouseover", removeOrigHighlightOnHoverHandler, false);
  li.setAttribute('data-abbreviation', stateObj.abbreviation); //for keyInpu_controller
  return li;
}

function showTextSearchResults(searchResults) {
  List.clearListedResults();

  var key = document.getElementById("searchInput").value,
      fragment = document.createDocumentFragment(), //use fragment to append all at once
      li;
  for (var i = 0;  i < searchResults.length; i += 1) {
    li = createElementWithDependencies(key, searchResults[i])
    fragment.appendChild(li);
  }

  if (searchResults.length > 0) {
    document.getElementById("result").appendChild(fragment);
    document.getElementById("result").style.display = "block";
  }
}

/**************************************************
************* Search Input Controller *************
***************************************************/

function displaySearchResults(jsonObj) {
  var searchResults = Models.createSearchResultsFromJsonArray(jsonObj);
  showTextSearchResults(searchResults);
  Map.highlightStates(searchResults);
  Clear.enableClearIcon();
}


function queryMatching() { 
  var key = document.getElementById("searchInput").value;

  if (key.length >= 1) {
    //Make AJAX Call
    Info.getJSONArray(key, 'State', displaySearchResults);
  }
  else {
    List.clearListedResults();
    Map.clearHighlightedStates();
    Clear.disableClearIcon();
  }


}

// add event listener to input field
document.getElementById("searchInput").addEventListener("input", queryMatching, false);





})(this);