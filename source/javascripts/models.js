/**************************************************
*** MODELS
***************************************************/
;(function(global) {
  'use strict';
  //Export
  var Models = global.Models = global.Models || {};
  Models.SearchResult = SearchResult;
  Models.createSearchResultsFromJsonArray = createSearchResultsFromJsonArray;


  //Helper Function. 
  //Add commas to a numeric string (e.g., 1,567,435)
  function numberWithCommasHelper(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //Class
  function SearchResult (obj) {
    this.stateName = obj.State;
    this.capital = obj.Capital;
    this.nickname = obj.Nickname;
    this.area_sqmi = numberWithCommasHelper(obj.Area_sqmi) + " sq mi";
    this.population = numberWithCommasHelper(obj.Population);
    this.flag = './images/' + obj.Flag;
    this.map = './images/' + obj.Map;
    this.abbreviation = obj.Abbreviation;
  }
   
  //Class's method.  Use Prototype so objects can share functionality with 
  //the same instance.
  SearchResult.prototype.addHTMLEmphasis = function (key) {
    var index = this.stateName.toLowerCase().indexOf(key.toLowerCase());

    return this.stateName.substr(0, index) + '<strong>' + 
           this.stateName.substr(index, key.length) + '</strong>' + 
           this.stateName.substr(index + key.length) ;
  };

  //Helper Function that's been made public (i.e., exported above)
  //Create an array of objects (SearchResults) from an array of JSON Obj
  function createSearchResultsFromJsonArray(jsonObj) {
    var instance, i;
    var searchResults = []; 
    for (i = 0; i < jsonObj.data.length; i += 1) {
      instance = new SearchResult(jsonObj.data[i]);
      searchResults.push(instance);
    }
    return searchResults;
  }

})(this);
