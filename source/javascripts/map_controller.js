/**************************************************
*** MAP CONTROLLER
***
*** Controls the display of states on the SVG map.
***************************************************/
;(function(global) {
  'use strict';
  //Dependencies and Import
  var Models = global.Models = global.Models || {};
  var AjaxHelper = global.AjaxHelper = global.AjaxHelper || {};
  var Info = global.Info = global.Info || {};
  var SearchInput = global.SearchInput = global.SearchInput || {};

  //Export
  var Map = global.Map = global.Map || {};
  Map.clearHighlightedStates = clearHighlightedStates;
  Map.highlightStates = highlightStates;
  Map.displaySelectedState = displaySelectedState;
  Map.darkenStateOnMapToMatchHighlightOnList = darkenStateOnMapToMatchHighlightOnList;


  //Local cache
  var svgObj = document.getElementById('svgmap');
  var svgDoc; //to be assigned a value when svgObj is loaded.  See last function.

  //Highlighted states on the map are those US states which names
  //also appear on the Listed Results.
  function clearHighlightedStates() {
    var highlightedStates = svgDoc.getElementsByClassName('highlighted'),
        lastElem,
        className;

    //Iterate in reverse because the array is a "live nodeList"
    while(highlightedStates.length > 0) {
      lastElem = highlightedStates[highlightedStates.length-1]; //get last item

      //Remove the 'highlighted' class from the element.  
      //This will automatically update the nodeList's length too.
      className = lastElem.getAttribute('class').replace('highlighted','').trim();
      lastElem.setAttribute('class', className);
    }
  }

  //The darkened state on the map is where the user has the highlight
  //on the Listed Results.
  function clearDarkenenedState() {
    var selected = svgDoc.getElementsByClassName('bordered');
    if (selected.length > 0) {
      var className = selected[0].getAttribute('class').replace('bordered','').trim();
      selected[0].setAttribute('class', className);
    }
  }

  //Selected state on the map is the one that corresponds to the dispalyed info section
  function clearSelectedState() {
    var selected = svgDoc.getElementsByClassName('selected');
    if (selected.length > 0) {
      var className = selected[0].getAttribute('class').replace('selected','').trim();
      selected[0].setAttribute('class', className);
    }
  }

  //Highlight the US states based on the array input.
  function highlightStates(objArray) {
    clearHighlightedStates();  //Clear all highlighted states
    clearDarkenenedState(); //Darkening can only happen after highlighting.

    var svgDoc = document.getElementById('svgmap').contentDocument,
        svgState, 
        className;

    //Iterate through the list states to be highlighted
    for(var i=0; i<objArray.length; i++) {
      svgState = svgDoc.getElementById(objArray[i].abbreviation);

      //check if svg element is already highlighted:
      className = svgState.getAttribute('class');
      className = (className.indexOf('highlighted') > -1) ? className : className + ' highlighted';
      svgState.setAttribute('class', className);
    }
  }

  //Darken the US state on the map based on the given single input.
  function darkenStateOnMapToMatchHighlightOnList(stateAbbreviation) {
    clearDarkenenedState();  //remove current darkenend state before replacing

    var svgState = svgObj.contentDocument.getElementById(stateAbbreviation);
    //check if svg element is already bordered:
    var className = svgState.getAttribute('class');
    className = (className.indexOf('bordered') > -1) ? className : className + ' bordered';
    svgState.setAttribute('class', className);
  }

  //Select the state the map.
  function selectTheState(stateAbbreviation) {
    clearSelectedState();
    clearDarkenenedState();

    var svgState = svgObj.contentDocument.getElementById(stateAbbreviation);
    //check if svg element is already selected:
    var className = svgState.getAttribute('class');
    className = (className.indexOf('selected') > -1) ? className : className + ' selected';
    svgState.setAttribute('class', className);
  }

  //Clear all activities, then display the selection. JsonObj is a single object.
  function displaySelectedState(jsonObj) {
    SearchInput.clearSearchInputAndMore();

    var searchResults = Models.createSearchResultsFromJsonArray(jsonObj);
    Info.updateInfo(searchResults[0]);
    selectTheState(searchResults[0].abbreviation);
  } 

  //There's only one clicked state, so we query that info and display it
  //right away.
  function queryClickedState() {
    var key = this.getAttribute('id');
    AjaxHelper.getJSONArray(key, 'Abbreviation', displaySelectedState);

  }

  //Add a load event listener to the object, as the svg doc is loaded asynchronously
  svgObj.addEventListener('load',function(){
    svgDoc = svgObj.contentDocument; //get the inner DOM of svg and save to local cache
    var svgPaths = svgDoc.getElementsByTagName('path'), //get elements
        x = svgPaths.length;

    for (var i=0; i<x; i++) {
      svgPaths[i].addEventListener('mousedown', queryClickedState, false);    //add behaviour
    }
  },false);

})(this);



