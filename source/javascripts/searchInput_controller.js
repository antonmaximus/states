/*global document: false, console: false, XMLHttpRequest: false */
/*global setInterval: false, clearInterval: false */

;(function(global) {
'use strict';

  //Dependencies and Import
  var Models = global.Models = global.Models || {};
  var Info = global.Info = global.Info || {};
  var Map = global.Map = global.Map || {};
  var List = global.List = global.List || {};

  //Make the following local functions accessible outside the closure
  var SearchInput = global.SearchInput = global.SearchInput || {};
  SearchInput.clearSearchInput = clearSearchInput;
  SearchInput.queryMatching = queryMatching;


/**************************************************
*** Text Search Results Controller *************
***************************************************/
function clearSearchInput() {
  document.getElementById("searchInput").value = "";
}

// Handle clicked item from the results li list
function mouseClickHandler(e) {
  clearSearchInput();
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
}


function queryMatching() { 
  var key = document.getElementById("searchInput").value;

  if (key.length >= 1) {
    //Make AJAX Call
    Info.getJSONArray(key, 'State', displaySearchResults)
  }
  else {
    List.clearListedResults();
    Map.clearHighlightedStates();
  }


}

// add event listener to input field
document.getElementById("searchInput").addEventListener("input", queryMatching, false);




/**************************************************
************* Clear Option Controller *************
***************************************************/

// //fadeType is either "fade-in" or "fade-out"
// function fadeHelper(element, fadeType) {
//   var initial, end, timer;
//   if (fadeType == 'fade-in') {
//     element.style.display = '';
//     initial = 0;  // initial opacity
//     end = 0.7; //It needs to be a li'l greyed-out
//   } else {
//     initial = 0.7; 
//     end = 0;
//   }

//   timer = setInterval(function () {
//     if (Math.abs(initial-end) <= 0.09){
//         clearInterval(timer);
//         element.style.display = (fadeType=='fade-out' ? 'none' : '');
//     }
//     element.style.opacity = initial;
//     initial += (end - initial) * 0.1;
//   }, 20);
// }


// function enableClearIcon() {
//   var elem = document.getElementById("clearOption");
//    // elem.className = "clearable";
//    if (elem.style.display != '') {
//     // fadeInHelper(elem);
//     fadeHelper(elem, 'fade-in');
//   }
// }

// function disableClearIcon() {
//   var elem = document.getElementById("clearOption");
//   // elem.className = "removeIcon";
//   // fadeOutHelper(elem);
//     fadeHelper(elem, 'fade-out');
// }



// function clearInput() {
//   var searchInput = document.getElementById("searchInput");
//   searchInput.value = "";
//   List.clearListedResults();
//   disableClearIcon();
//   searchInput.focus();
// }

// function clearInputOnEnter(e) {
//   if (e.keyCode == '13') {
//     clearInput();
//   }
// }

// document.getElementById("clearOption").addEventListener("click", clearInput, false);
// document.getElementById("clearOption").addEventListener("keydown", clearInputOnEnter, false);


})(this);