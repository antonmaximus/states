
;(function(global) {
  global.models = global.models || {};

  global.models.SearchResult = SearchResult;
  global.models.searchResults = [];
  
  function numberWithCommasHelper(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function SearchResult (obj) {
    this.state = obj.State;
    this.capital = obj.Capital;
    this.nickname = obj.Nickname;
    this.area_sqmi = numberWithCommasHelper(obj.Area_sqmi) + " sq mi";
    this.population = numberWithCommasHelper(obj.Population);
    this.flag = './images/' + obj.Flag;
    this.map = './images/' + obj.Map;
  }
   
  SearchResult.prototype.addHTMLEmphasis = function (key) {
    var index = this.state.toLowerCase().indexOf(key.toLowerCase());

    return this.state.substr(0, index) + '<strong>' + 
           this.state.substr(index, key.length) + '</strong>' + 
           this.state.substr(index + key.length) ;
  }
  
})(this);