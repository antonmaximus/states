/*******************************************
************* Helper Functions *************
********************************************/

function clearDisplayedSearchResults() {
  var ul = document.getElementById("result");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild); //this also removes any event listeners
  }
  document.getElementById("result").style.display = "none";
}

function boldStringAtLocationHelper(origKey, origStr) {
  var key = origKey.toLowerCase(),
      index = origStr.toLowerCase().indexOf(key);

  return origStr.substr(0, index) + '<strong>' + 
          origStr.substr(index, key.length) + '</strong>' + 
          origStr.substr(index + key.length) ;
}

//Use browser's functionality to strip HTML tags
function stripHTMLTagHelper(html) {
   var tmp = document.createElement("div");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

//Return next item depending if user pressed up arrow or down arrow
function getSiblingHelper(highlighted, arrowkey) {
  var sibling; 

  if (highlighted.nextSibling===null && highlighted.previousSibling===null) {
    return null; //there's only one element
  }

  if(arrowkey == '40') { //down arrow
    sibling = (highlighted.nextSibling !== null ? 
      highlighted.nextSibling : highlighted.parentNode.firstChild);
  }
  else if (arrowkey == '38') { //up arrow
    sibling = (highlighted.previousSibling !== null ? 
      highlighted.previousSibling : highlighted.parentNode.lastChild);
  }
  return sibling;
}

//fadeType is either "fade-in" or "fade-out"
function fadeToggleHelper(element, fadeType) {
  var initial, end, timer;
  if (fadeType == 'fade-in') {
    element.style.display = '';
    initial = 0;  // initial opacity
    end = 0.7; //It needs to be a li'l greyed-out
  } else {
    initial = 0.7; 
    end = 0;
  }

  timer = setInterval(function () {
    if (Math.abs(initial-end) <= 0.09){
        clearInterval(timer);
        element.style.display = (fadeType=='fade-out' ? 'none' : '');
    }
    element.style.opacity = initial;
    initial += (end - initial) * 0.1;
  }, 20);
}

/*************************************************
************* Update View Controller *************
**************************************************/

//Update the html elements
function revealDataFromSelectedKey(preProcessedKey) {
  var key = stripHTMLTagHelper(preProcessedKey),
    matchingObj,
    x,
    ids = ['state', 'capital', 'nickname', 'area_sqmi', 'population', 'flag', 'map'];

  document.getElementById("searchInput").value = key;
  clearDisplayedSearchResults();


  if (document.getElementById("state").innerHTML != key) {
    for(x=0; x < window.searchResults.length; x+=1){
      if(window.searchResults[x].state == key) {
        matchingObj = window.searchResults[x];
      }
    }

    for(x=0; x < ids.length; x+=1) {
      if(ids[x]=='flag' || ids[x]=='map') {
        document.getElementById(ids[x]).src = matchingObj[ids[x]];
        document.getElementById(ids[x]).alt = matchingObj.state + ' ' + ids[x];
        document.getElementById(ids[x]).title = matchingObj.state + ' ' + ids[x];
      } else {
        document.getElementById(ids[x]).innerHTML = matchingObj[ids[x]];
      }
    }
  }
}


// Handle clicked item from the results li list
function mouseClickHandler(e) {
  revealDataFromSelectedKey(e.target.innerHTML);
}
//Handle mouse hover on highlighted items set by keyboard
function removeOrigHighlightOnHoverHandler() {
  var highlighted = document.getElementById('highlighted');
  if (highlighted !== null) {
    highlighted.removeAttribute("id");
  }
}

//Dependent on mouseClickHandler and removeOrigHighlightOnHoverHandler
function revealSearchResults(key) {
  var ul, li, i, boldStr;
  clearDisplayedSearchResults();

  ul = document.getElementById("result");
  for (i = 0;  i < window.searchResults.length; i += 1) {
    li = document.createElement("li");

    boldStr = boldStringAtLocationHelper(key, window.searchResults[i].state);
    li.innerHTML = boldStr;
    li.addEventListener("click", mouseClickHandler, false);
    li.addEventListener("mouseover", removeOrigHighlightOnHoverHandler, false);
    ul.appendChild(li);
  }

  if (window.searchResults.length > 0) {
    document.getElementById("result").style.display = "block";
  }
}

function revealNoStatesFound() {
  var key = document.getElementById("searchInput").value,
      noState = document.getElementById("noState");

  noState.innerHTML = "\'" + key + "\' is not a US state.";
  noState.className = "reveal";

  document.getElementById("map").style.display = "none";
  document.getElementsByClassName("stateInfo")[0].className += " noShow";
}
/**************************************************
************* Search Input Controller *************
***************************************************/

function storeSearchResults(jsonObj) {
  var instance;
  window.searchResults = []; //flush out old info
  for (i = 0; i < jsonObj.data.length; i += 1) {
    instance = new searchResult(jsonObj.data[i]);
    window.searchResults.push(instance);
  }
}

function enableClearIcon() {
  var elem = document.getElementById("clearOption");
   // elem.className = "clearable";
   if (elem.style.display != '') {
    // fadeInHelper(elem);
    fadeToggleHelper(elem, 'fade-in');
  }
}

function disableClearIcon() {
  var elem = document.getElementById("clearOption");
  // elem.className = "removeIcon";
  // fadeOutHelper(elem);
    fadeToggleHelper(elem, 'fade-out');

}

function sendRequestToServer() { 
  var key = document.getElementById("searchInput").value,
      parameters = "?input=" + key + "&field=State" + "&t=" + Math.random(),
      path = "./php/serverSideParser.php",
      xhr = new XMLHttpRequest(),
      text, ul, li,
      jsonObj;

  if (key.length >= 1) {
    //Make AJAX Call
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) { //success
          jsonObj = JSON.parse(xhr.responseText);
          storeSearchResults(jsonObj);
          revealSearchResults(key);
        } else {
          console.error(xhr);
          text = ['"Data Not Available"'];
          clearDisplayedSearchResults();
          revealDataFromSelectedKey(text);
          //Make item Un-Clickable
          ul = document.getElementById("result"); 
          li = ul.getElementsByTagName('li');
          li[0].style.cursor = "default"; 
          li[0].style.background = "none"; 
          li[0].removeEventListener('click', mouseClickHandler, false);
          li[0].removeEventListener('mouseover', mouseClickHandler, false);
        }
      }
    };
    xhr.open("GET", path + parameters, true);
    xhr.send();
    enableClearIcon();
  } else {
    clearDisplayedSearchResults();
    disableClearIcon();
  }

}

// add event listener to input field
document.getElementById("searchInput").addEventListener("input", sendRequestToServer, false);



/*************************************************************
************* Return, ESC, Arrow Keys Controller *************
**************************************************************/
//Dependency:  "Search Input Controller"


//Highlight an item on the resulting <li> items
function highlightHTMLElementViaArrowKey(key) {
  var highlighted = document.getElementById('highlighted'),
      li, x, sibling;
  if (highlighted === null) {
    li = document.getElementById("result").getElementsByTagName('li');
    x = (key == '40' ? 0 : li.length-1);
    li[x].id = "highlighted";
  }
  else {
    sibling = getSiblingHelper(highlighted, key);
    if (sibling) {
      sibling.id = "highlighted";
      highlighted.removeAttribute("id");
    }
  }
}


//Special keys are Return, ESC, Up, & Down Arrow Keys
function handleSpecialKey(e) {
  var key = e.keyCode,
      highlighted = document.getElementById("highlighted"),
      li = document.getElementById("result").getElementsByTagName('li');

  //Handle 'Return' key

  if (key == '13') { 
    //If a <li> item is already highlighted, use that item
    if (highlighted !== null) { 
      revealDataFromSelectedKey(highlighted.innerHTML);
    }
    // If none is highlighted and only one result, select that item by default
    // else if (li.length == 1) {
    //   revealDataFromSelectedKey(li[0].innerHTML);
    // } 
    //If none is highlighted and there are multiple results, 
    //highlight the first  <li> item
    else if (li.length >= 1) { 
      highlightHTMLElementViaArrowKey('40'); 
    }  
    //This cas happens if a user has already hit 'esc',
    //and then hits 'enter' to re-query
    else if (li.length == 0) {
      sendRequestToServer(); 
    }
  } 

  //Handle Up or Down Arrow keys
  else if (key == '38' || key == '40') {
    if (li.length >= 1) {
      highlightHTMLElementViaArrowKey(key);
    } else {
      sendRequestToServer(); 
    }
  }

  //Clear items when 'esc' key is pressed
  else if (key == '27') {
    clearDisplayedSearchResults();
  }

}

document.getElementById("searchInput").addEventListener("keydown", handleSpecialKey, false);


/**************************************************
************* Clear Option Controller *************
***************************************************/

function clearInput() {
  var searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  clearDisplayedSearchResults();
  disableClearIcon();
  searchInput.focus();
}

function clearInputOnEnter(e) {
  if (e.keyCode == '13') {
    clearInput();
  }
}

document.getElementById("clearOption").addEventListener("click", clearInput, false);
document.getElementById("clearOption").addEventListener("keydown", clearInputOnEnter, false);

