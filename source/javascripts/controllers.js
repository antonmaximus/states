
//Clear results
function clearSearchItemsHelper() {
  var ul = document.getElementById("result");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild); //this also removes any event listeners
  }
  document.getElementById("result").style.display = "none";
}

//Use browser's functionality to strip HTML tags
function stripHTMLTagHelper(html) {
   var tmp = document.createElement("div");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

function boldStringAtIndexHelper(index, key, origStr) {
  return origStr.substr(0, index) + '<strong>' + 
          origStr.substr(index, key.length) + '</strong>' + 
          origStr.substr(index + key.length) ;
}

//Update <li> items with ajax results 
function updateItems(searchResults) {
  var ul, i, item;
  ul = document.getElementById("result");
  for (i = 0;  i < searchResults.length; i += 1) {
    item = document.createElement("li");
    item.innerHTML = searchResults[i];
    // item.addEventListener("click", mouseClickHandler, false);
    // item.addEventListener("mouseover", removeOtherHighlightHandler, false);
    ul.appendChild(item);
  }


  if (searchResults.length > 0) {
    document.getElementById("result").style.display = "block";
  }
}



//Add <strong> emphasis on part of the string
function loadSearchResults(key, jsonObj) { 
  var searchResults, i, index, boldedStr;
  searchResults = [];

  if(jsonObj.data.length == 0) {
    clearSearchItemsHelper();
  }
  else {
    key = key.toLowerCase();
    //This for-loop loads the JSON data to an array.
    for (i = 0; i < jsonObj.data.length; i += 1) {
      lowerCaseStr = jsonObj.data[i].State.toLowerCase();
      index = lowerCaseStr.indexOf(key);

      boldedStr = boldStringAtIndexHelper(index, key, jsonObj.data[i].State);
      searchResults.push(boldedStr);  //Title Case
    }
    clearSearchItemsHelper();
    updateItems(searchResults);
  }
}



//If there are 2 or more characters, make AJAX calls
function searchInputController() { 
  var key = document.getElementById("searchInput").value,
      parameters = "?input=" + key + "&field=State" + "&t=" + Math.random(),
      path = "./php/serverSideParser.php",
      xhr = new XMLHttpRequest(),
      text, ul, li,
      jsonObj;

  if (key.length >= 2) {
    //Make AJAX Call
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) { //success
          jsonObj = JSON.parse(xhr.responseText);
          loadSearchResults(key, jsonObj);
        } else {
          console.error(xhr);
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
    };
    xhr.open("GET", path + parameters, true);
    xhr.send();

  } 
  else {
    clearSearchItemsHelper();
  }
}

