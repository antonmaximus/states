;(function(global) {
'use strict';

//Global Import
var Models = global.Models = global.Models || {};
var Info = global.Info = global.Info || {};

//Make the following local functions accessible outside the closure
var Map = global.Map = global.Map || {};
Map.clearHighlightedStates = clearHighlightedStates;
Map.highlightStates = highlightStates;
Map.displaySelectedState = displaySelectedState;


var svgObj = document.getElementById('svgmap');


/**************************************************
************* Map Controller *************
***************************************************/
function clearHighlightedStates() {
  var svgDoc = document.getElementById('svgmap').contentDocument;
  var highlightedPaths = svgDoc.getElementsByClassName('highlighted'),
      lastElem,
      className;

  //Iterate in reverse because the array is a "live nodeList"
  while(highlightedPaths.length > 0) {
    lastElem = highlightedPaths[highlightedPaths.length-1]; //get last item

    //Remove the 'highlighted' class from the element.  
    //This will automatically update the nodeList's length too.
    className = lastElem.getAttribute('class').replace('highlighted','').trim();
    lastElem.setAttribute('class', className);
  }
}

//Clear the only selected state
function clearSelectedState() {
  var selected = svgObj.contentDocument.getElementsByClassName('selected');
  if (selected.length > 0) {
    var className = selected[0].getAttribute('class').replace('selected','').trim();
    selected[0].setAttribute('class', className);
  }
}

function highlightStates(objArray) {
  clearHighlightedStates();  //Clear all highlighted states

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

function selectTheState(stateAbbreviation) {
  var svgState = svgObj.contentDocument.getElementById(stateAbbreviation);
  //check if svg element is already selected:
  var className = svgState.getAttribute('class');
  className = (className.indexOf('selected') > -1) ? className : className + ' selected';
  svgState.setAttribute('class', className);
}





function displaySelectedState(jsonObj) {
  clearHighlightedStates();
  clearSelectedState();

  var searchResults = Models.createSearchResultsFromJsonArray(jsonObj);
  Info.updateInfo(searchResults[0]);
  selectTheState(searchResults[0].abbreviation);
}


function queryClickedState() {
  //AJAX Request
  var key = this.getAttribute('id');
  Info.getJSONArray(key, 'Abbreviation', displaySelectedState);

}

//Add a load event listener to the object, as the svg doc is loaded asynchronously
svgObj.addEventListener('load',function(){
  var svgDoc = svgObj.contentDocument, //get the inner DOM of svg
   svgPaths = svgDoc.getElementsByTagName('path'), //get elements
   x = svgPaths.length;

  for (var i=0; i<x; i++) {
    svgPaths[i].addEventListener('mousedown', queryClickedState, false);    //add behaviour
  }
},false);

})(this);



