// Author: Anton Agana
// 
// INFO: This JavaScript file will issue a GET request to the server 
// when there's at least 2 characters placed in the input field. 
//
//
/*global document: false */
/*global XMLHttpRequest: false */
/*global console: false */


(function () {
'use strict';

var $regex = /^[A-Za-z\s]/,
    $jsonObj;

//Clear results
function clearItems() {
  var ul = document.getElementById("result");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild); //this also removes any event listeners
  }
  document.getElementById("result").style.display = "none";
}

//Return the numeric string with commas for easy-reading
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//Update elements in the HTML file
function updateElements(selectedItem) {
  var obj, x;
  for(x=0; x < $jsonObj.data.length; x+=1){
    if($jsonObj.data[x].State == selectedItem) {
      obj = $jsonObj.data[x];
    }
  }

  if (document.getElementById("stateName").innerHTML != obj.State) {
    document.getElementById("stateName").innerHTML = obj.State;
    document.getElementById("capital").innerHTML = obj.Capital;
    document.getElementById("area_sqmi").innerHTML = 
      numberWithCommas(obj.Area_sqmi) + " sq mi";
    document.getElementById("population").innerHTML = 
      numberWithCommas(obj.Population);

    document.getElementById("flag").src = './images/' + obj.Flag;
    document.getElementById("map").src = './images/' + obj.Map;
  }
}

//Extract string and remove inner html elements
function extractString(str) {
  var i = 0, 
      new_str = "",
      insideSpan = false;

  for (i; i < str.length; i += 1) {
    //Ignore HTML elements
    if (str[i] == '>') {
      insideSpan = false;
    }   
    else if (str[i] == '<') {
      insideSpan = true;
    } 


    if (!insideSpan && $regex.test(str[i])) {
      new_str += str[i];
    }
  }
  return new_str;
} 

//Update the search input field, and then other html elements
function updateSearchInput(selectedItem) {
  var text = extractString(selectedItem);
  document.getElementById("searchInput").value = text;
  clearItems();
  updateElements(text);
}

// Handle clicked item from the results li list
function mouseClickHandler(e) {
  updateSearchInput(e.target.innerHTML);
}

//Handle mouse hover on highlighted items set by keyboard
function removeOtherHighlightHandler() {
  var highlighted = document.getElementById('highlighted');
  if (highlighted !== null) {
    highlighted.removeAttribute("id");
  }
}


//Update <li> items with ajax results 
function updateItems(searchResults) {
  var ul, i, item;
  ul = document.getElementById("result");
  for (i = 0;  i < searchResults.length; i += 1) {
    item = document.createElement("li");
    item.innerHTML = searchResults[i];
    item.addEventListener("click", mouseClickHandler, false);
    item.addEventListener("mouseover", removeOtherHighlightHandler, false);
    ul.appendChild(item);
  }


  if (searchResults.length > 0) {
    document.getElementById("result").style.display = "block";
  }
}

//Capitalize string while keeping inner HTML elements intact
function toTitleCase(str) {
  var i,
      toCapitalize = true,
      insideSpan = false,
      new_str = "";

  for (i=0; i<str.length; i+=1) {
    //Ignore HTML elements
    if (str[i] == '>') {
      insideSpan = false;
    } 
    else if (str[i] == '<') {
      insideSpan = true;
    } 
    
    if (!insideSpan && $regex.test(str[i]) && toCapitalize) {
      new_str += str[i].toUpperCase();
      toCapitalize = false;
    } 
    else {
      new_str += str[i];
      toCapitalize = (str[i]==' ') ? true : toCapitalize; 
    }

  }
  return new_str;
}

//Add <strong> emphasis on part of the string
function qualifyData(key, jsonObj) { 
  var searchResults, i, item;
  searchResults = [];

  if(jsonObj.data.length == 0) {
    clearItems();
  }
  else {
    key = key.toLowerCase();
    //This for-loop loads the JSON data to an array.
    for (i = 0; i < jsonObj.data.length; i += 1) {
      item = jsonObj.data[i].State;
      item = item.toLowerCase().replace(key, '<strong>'+ key +'</strong>');
      item = toTitleCase(item);

      searchResults.push(item);  //Title Case
    }
    clearItems();
    updateItems(searchResults);
  }
}


//Load JSON using AJAX
function loadJSON(path, key, success, error) {
  var jsonObj, text, ul, li,
      xhr = new XMLHttpRequest(),
      //Math.random is used to avoid cached info
      parameters = "?input=" + key + "&field=State" + "&t=" + Math.random(); 

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (success) {
          jsonObj = JSON.parse(xhr.responseText);
          success(jsonObj);
          $jsonObj = jsonObj;
          qualifyData(key, jsonObj);
        }
      } else {
        if (error) {
          error(xhr);
          text = ['"Data Not Available"'];
          clearItems();
          updateItems(text);
          //Make item Un-Clickable
          ul = document.getElementById("result"); 
          li = ul.getElementsByTagName('li');
          li[0].style.cursor = "default"; 
          li[0].style.background = "none"; 
          li[0].removeEventListener('click', mouseClickHandler, false);
          li[0].removeEventListener('mouseover', mouseClickHandler, false);
        }
      }
    }
  };
  xhr.open("GET", path + parameters, true);
  xhr.send();
}


//If there are 2 or more characters, make AJAX calls
function userIsTyping() { 
  var key = document.getElementById("searchInput").value;
  if (key.length >= 2) {
    loadJSON( "./php/serverSideParser.php", key,
         function(data) { console.log(data); },
         function(xhr) { console.error(xhr); }
        );
  } 
  else {
    clearItems();
  }
}

//Return next item depending if user pressed up arrow or down arrow
function getSibling(highlighted, arrowkey) {
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

//Highlight an item on the resulting <li> items
function highlightItem(key) {
  var highlighted = document.getElementById('highlighted'),
      li, x, sibling;
  if (highlighted === null) {
    li = document.getElementById("result").getElementsByTagName('li');
    x = (key == '40' ? 0 : li.length-1);
    li[x].id = "highlighted";
  }
  else {
    sibling = getSibling(highlighted, key);
    if (sibling) {
      sibling.id = "highlighted";
      highlighted.removeAttribute("id");
    }
  }
}

//
function keypressedHandler(e) {
  var key = e.keyCode,
      highlighted = document.getElementById("highlighted"),
      li = document.getElementById("result").getElementsByTagName('li');

  //Handle 'Return' key
  if (key == '13') { 
    //If an <li> item is already highlighted select that
    if (highlighted !== null) { 
      updateSearchInput(highlighted.innerHTML);
    }
    //If none is highlighted and there are multiple results, 
    //highlight the first  <li> item
    else if (li.length >= 2) { 
      highlightItem('40'); 
    }
    //If none is highlighted and only one result, select that item by default
    else if (li.length == 1) {
      updateSearchInput(li[0].innerHTML);
    } 
    //This cas happens if a user has already hit 'esc',
    //and then htis 'enter' to re-query
    else if (li.length == 0) {
      userIsTyping(); 
    }
  } 

  //Handle Up or Down Arrow keys
  else if (key == '38' || key == '40') {
    highlightItem(key);
  }

  //Clear items when 'esc' key is pressed
  else if (key == '27') {
    clearItems();
  }

}

// add event listener to input field
document.getElementById("searchInput").addEventListener("input", userIsTyping, false);
document.getElementById("searchInput").addEventListener("keydown", keypressedHandler, false);

}());


