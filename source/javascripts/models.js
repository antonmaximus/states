
;(function(global) {
  'use strict';
  //Make the following local functions accessible outside the closure
  var Models = global.Models = global.Models || {};
  Models.SearchResult = SearchResult;
  Models.createSearchResultsFromJsonArray = createSearchResultsFromJsonArray;


  
  function numberWithCommasHelper(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
   
  SearchResult.prototype.addHTMLEmphasis = function (key) {
    var index = this.stateName.toLowerCase().indexOf(key.toLowerCase());

    return this.stateName.substr(0, index) + '<strong>' + 
           this.stateName.substr(index, key.length) + '</strong>' + 
           this.stateName.substr(index + key.length) ;
  };
  


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


// var MODELS = (function() {
//   'use strict';



//   function numberWithCommasHelper(x) {
//       return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   }

//   function SearchResult (obj) {
//     this.stateName = obj.State;
//     this.capital = obj.Capital;
//     this.nickname = obj.Nickname;
//     this.area_sqmi = numberWithCommasHelper(obj.Area_sqmi) + " sq mi";
//     this.population = numberWithCommasHelper(obj.Population);
//     this.flag = './images/' + obj.Flag;
//   }

//   SearchResult.prototype.addHTMLEmphasis = function (key) {
//     var index = this.state.toLowerCase().indexOf(key.toLowerCase());

//     return this.state.substr(0, index) + '<strong>' + 
//            this.state.substr(index, key.length) + '</strong>' + 
//            this.state.substr(index + key.length) ;
//   };



// })();