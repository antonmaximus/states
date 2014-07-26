/**************************************************
*** AJAX HELPER
***
*** Make an AJAX call.  If success, use callback function.
*** Otherwise, inform user of unavailable data.
***************************************************/

;(function(global) {
  'use strict';
  //Dependencies and Imports
  var SearchInput = global.SearchInput = global.SearchInput || {};

  //Export
  var AjaxHelper = global.AjaxHelper = global.AjaxHelper || {};
  AjaxHelper.getJSONArray = getJSONArray;


  function jsonError() {
    SearchInput.clearSearchInputAndMore();
    var li = document.createElement("li");
    li.innerHTML = "\"Data Not Available.\"";
    li.setAttribute('data-abbreviation', "error"); //for keyInput_controller
    document.getElementById("result").appendChild(li);
    document.getElementById("result").style.display = "block";
  }

  // AJAX
  function getJSONArray(key, field, callback) {
    //add time on URL path to prevent caching
    var parameters = "?input=" + key + "&field=" + field + "&t=" + Math.random(),
        path = "./php/serverSideParser.php",
        xhr = new XMLHttpRequest(),
        jsonObj;

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) { //success
          try {
            jsonObj = JSON.parse(xhr.responseText);
            callback(jsonObj);
          } catch(err) {
            jsonError();
          }
        } else {
          jsonError();
        }
      }
    };
    xhr.open("GET", path + parameters, true);
    xhr.send();
  }

})(this);