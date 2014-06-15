
//Singleton
var searchResults = [];


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function searchResult (obj) {
  this.state = obj.State;
  this.capital = obj.Capital;
  this.area_sqmi = numberWithCommas(obj.Area_sqmi) + " sq mi";
  this.population = numberWithCommas(obj.Population);
  this.flag = './images/' + obj.Flag;
  this.map = './images/' + obj.Map;
}
 
// Apple.prototype.getInfo = function() {
//     return this.color + ' ' + this.type + ' apple';
// };


// add event listener to input field
document.getElementById("searchInput").addEventListener("input", searchInputController, false);