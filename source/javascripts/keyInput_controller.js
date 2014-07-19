;(function(global) {
  'use strict';

  //Dependencies and Imports
  var List = global.List = global.List || {};
  var SearchInput = global.SearchInput = global.SearchInput || {};


/*************************************************************
************* Return, ESC, Arrow Keys Controller *************
**************************************************************/
//Dependency:  "Search Input Controller"

//Return next item depending if user pressed up arrow or down arrow
function getSiblingHelper(highlighted, arrowkey) {
  var sibling; 

  if (highlighted.nextSibling===null && highlighted.previousSibling===null) {
    return null; //there's only one element, so nothing to traverse
  }

  if(arrowkey == '40') { //down arrow
    //get next sibling if it exists or loop back up;
    sibling = highlighted.nextSibling || highlighted.parentNode.firstChild;
  }
  else if (arrowkey == '38') { //up arrow
    //get previous sibling if it exists or loop down to the bottom;
    sibling = highlighted.previousSibling || highlighted.parentNode.lastChild;
  }
  return sibling;
}

function assignIdAndAttribute(elem) {
    elem.id = "highlighted";
    Map.borderTheState(elem.getAttribute('data-abbreviation'));
}

//Process Down Or Up Arrow Key
function highlightListedItemViaArrowKey(key) {
  var highlighted = document.getElementById('highlighted'),
      li, x, sibling;

  if (highlighted === null) { //If nothing is highlighted, highlight firs/last item
    li = document.getElementById("result").getElementsByTagName('li');
    //If down key, select first child. Else, up.
    x = (key=='40' ? 0 : li.length-1); 
    assignIdAndAttribute(li[x]);
  }
  else { //If something is highlighted, move the highlight to sibling
    sibling = getSiblingHelper(highlighted, key);
    if (sibling) {
      assignIdAndAttribute(sibling);
      highlighted.removeAttribute("id");
    }
  }
}


//Special keys are Return, ESC, Up, & Down Arrow Keys
function selectInList(e) {
  var key = e.keyCode,
      highlighted = document.getElementById("highlighted"),
      listedResults = document.getElementById("result").getElementsByTagName('li');

  //Handle 'Return' key
  if (key == '13') { 
    //If a <li> item is already highlighted, select that item
    if (highlighted !== null) { 
      List.selectStateFromList(highlighted.innerHTML);
      SearchInput.clearSearchInput();
    }
    //if there's a list and non is highlighted, navigate down
    else if (listedResults.length >= 1) { 
      highlightListedItemViaArrowKey('40'); 
    }  
    //This case happens if a user has already hit 'esc',
    //and then hits 'enter' to re-query
    else if (listedResults.length == 0) {
      SearchInput.queryMatching();
    }
  } 
  //Handle Up or Down Arrow keys
  else if (key == '38' || key == '40') {
    if (listedResults.length >= 1) {
      highlightListedItemViaArrowKey(key);
    }
  }
  //Clear items when 'esc' key is pressed
  else if (key == '27') {
    List.clearListedResults();
  }

}

document.getElementById("searchInput").addEventListener("keydown", selectInList, false);

})(this);
