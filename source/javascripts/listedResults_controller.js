;(function(global) {
'use strict';

  //Global Import
  var Info = global.Info = global.Info || {};
  var Map = global.Map = global.Map || {};

  //Make the following local functions accessible outside the closure
  var List = global.List = global.List || {};
  List.clearListedResults = clearListedResults;
  List.selectStateFromList = selectStateFromList;



  function clearListedResults() {
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
     //textContext returns all possible whitespaces
     return tmp.textContent||tmp.innerText; 
  }


  function clearListAndDisplay(jsonObj) {
    // clearListedResults();
    Map.displaySelectedState(jsonObj);
  }


  function selectStateFromList(innerHTML) {
    //Get state information
    var key = stripHTMLTagHelper(innerHTML);
    Info.getJSONArray(key, 'State', clearListAndDisplay);
  }




})(this);