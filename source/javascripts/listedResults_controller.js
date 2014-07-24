/**************************************************
*** LISTED RESULTS CONTROLLER
***
*** Displays/undisplay the Listed Results.
***************************************************/
;(function(global) {
  'use strict';
  //Dependencies and Import
  var AjaxHelper = global.AjaxHelper = global.AjaxHelper || {};
  var Map = global.Map = global.Map || {};
  var SearchInput = global.SearchInput = global.SearchInput || {};

  //Export
  var List = global.List = global.List || {};
  List.clearListedResults = clearListedResults;
  List.selectStateFromList = selectStateFromList;
  List.showTextSearchResults = showTextSearchResults;

  //Remove each <li> element and its listeners. 
  //Then undisplay the parent <ul> element.
  function clearListedResults() {
    var ul = document.getElementById("result");
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild); //this also removes any event listeners
    }
    document.getElementById("result").style.display = "none";
  }

  //Helper Function. 
  //Use browser's functionality to strip HTML tags
  function stripHTMLTagHelper(html) {
     var tmp = document.createElement("div");
     tmp.innerHTML = html;
     //textContext returns all possible whitespaces
     return tmp.textContent||tmp.innerText; 
  }

  //Select the US state where the input is the <li>'s innerHTML
  function selectStateFromList(innerHTML) {
    var key = stripHTMLTagHelper(innerHTML);
    AjaxHelper.getJSONArray(key, 'State', Map.displaySelectedState);
  }


  // Handle clicked item on the Listed Results
  function mouseClickHandler(e) {
    SearchInput.clearSearchInputAndMore();
    selectStateFromList(e.target.innerHTML);
  }

  //Cancel keyboard highlight, then highlight item that mouse hovered on.
  function removeOrigHighlightOnHoverHandler() {
    var highlighted = document.getElementById('highlighted');
    if (highlighted !== null) {
      highlighted.removeAttribute("id");
    }
  }

  //Create an <li> element and apply listeners/attributes
  function createElementWithDependencies (key, stateObj) {
    var li = document.createElement("li");
    li.innerHTML = stateObj.addHTMLEmphasis(key);
    li.addEventListener("click", mouseClickHandler, false);
    li.addEventListener("mouseover", removeOrigHighlightOnHoverHandler, false);
    li.setAttribute('data-abbreviation', stateObj.abbreviation); //for keyInput_controller
    return li;
  }

  //Display <ul> element after creating the necessary children <li> elements
  function showTextSearchResults(searchResults) {
    clearListedResults(); //clear current Listed Results if any

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


})(this);