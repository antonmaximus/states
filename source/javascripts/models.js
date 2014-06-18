
//Singleton
window.searchResults = [];

function numberWithCommasHelper(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function searchResult (obj) {
  this.state = obj.State;
  this.capital = obj.Capital;
  this.nickname = obj.Nickname;
  this.area_sqmi = numberWithCommasHelper(obj.Area_sqmi) + " sq mi";
  this.population = numberWithCommasHelper(obj.Population);
  this.flag = './images/' + obj.Flag;
  this.map = './images/' + obj.Map;
}
 
