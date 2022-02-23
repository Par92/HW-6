var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#location');
var weatherContainerEl = document.querySelector('#weather-container');
var apiSearchTerm = document.querySelector('#api-search-term');
var dayOneEl = document.querySelector('#day1');
var day1header = document.querySelector('#dh1');
var savedSearches = document.querySelector('#saved-searches');
var city = [];




var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var cityName = cityInputEl.value.trim();
    console.log(cityName);
    
    if (cityName) {
      getLatLon(cityName);
      localStorage.setItem("cityInput", JSON.stringify(cityName));
      city.push(cityName);
      renderSearches();
  
      weatherContainerEl.textContent = '';
      cityInputEl.value = '';
    } else {
      alert('Please enter a location');
    }
};

function savedSubmit(event) {
  event.preventDefault();
  var cityName = event.path[0].innerText;
  getLatLon(cityName);
  console.log(event.path[0].innerText);


}

var getLatLon = function (location) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=1&appid=b5493b5e591f2ce790124d4d8e2161f6';
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            // getWeather(data, location);
            get5dayWeather(data, location);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });
};

// var getWeather = function (data, location){
//     var lat = (data[0].lat);
//     //console.log(lat);
//     var lon = (data[0].lon)
//     //console.log(lon);
//     var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=b5493b5e591f2ce790124d4d8e2161f6&units=imperial';

//     fetch(apiUrl)
//       .then(function (response) { 
//         response.json().then(function (data) {
//         console.log(data);
//         displayWeather(data);
//         });
//     });
// };

var get5dayWeather = function (data, location){
    removeAllChildNodes(day1header);
    title = document.createElement('div');
    title.textContent = (data[0].name);
    day1header.appendChild(title);
    title.style.fontSize = "25px";
    title.style.fontWeight = "bold";

    var lat = (data[0].lat);
    //console.log(lat);
    var lon = (data[0].lon)
    //console.log(lon);
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,minutely,alerts&appid=c2e4df980ffeff663007a19f041dbf74&units=imperial';

    fetch(apiUrl)
      .then(function (response) { 
        response.json().then(function (data) {
        console.log(data);
        displayWeather(data);
        display5dayWeather(data);
        });
    });
};

var displayWeather = function (data){
  removeAllChildNodes(weatherContainerEl);

    temp = document.createElement('div');
    temp.textContent = "Temperature: " + (data.current.temp) + "°F";
    weatherContainerEl.appendChild(temp);

    // feel = document.createElement('div');
    // feel.textContent = "Feels like: " + (data.current.feels_like) + "°F";
    // weatherContainerEl.appendChild(feel);

    icon = document.createElement('img');
    icon.src = "http://openweathermap.org/img/wn/" + (data.current.weather[0].icon) + "@2x.png";
    weatherContainerEl.appendChild(icon);

    uvi = document.createElement('div');
    uvi.textContent = "UVI: " + (data.current.uvi);
    weatherContainerEl.appendChild(uvi);

    if ((data.current.uvi) < 3) {
      uvi.style.color = "#ffe600"
      uvi.style.backgroundColor = "#022b83"
    } else if ((data.current.uvi) > 6){
      uvi.style.color = "#ff0000"
      uvi.style.backgroundColor = "#022b83"
    }


    humidity = document.createElement('div');
    humidity.textContent = "Humidity: " + (data.current.humidity) + "%";
    weatherContainerEl.appendChild(humidity);

    wind = document.createElement('div');
    wind.textContent = "Wind: " + (data.current.wind_speed) + " MPH";
    weatherContainerEl.appendChild(wind);
   
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

var display5dayWeather = function (data){
   
  // let table = document.querySelector('#weather_forcast');
   // let headersRow = document.querySelector('#headers');
    let dayInfoRow = document.querySelector('#dayInfo');
    removeAllChildNodes(dayInfoRow);

    for (var i = 1; i < 6 ; i++) { 
      
      //let dayHeader = document.createElement('th');
      // Do css for day header
      var date = document.createElement('div');
      var myDate = new Date((data.daily[i].dt)*1000);
      date.textContent = (getFormattedDateString(myDate));
      date.className = "day-header";
      //headersRow.appendChild(date);

      var temp = document.createElement('div');
      temp.textContent = ((data.daily[i].temp.day) + "°F");
      // get temp info 

      var icon = document.createElement('img');
      icon.src = "http://openweathermap.org/img/wn/" + (data.daily[i].weather[0].icon) + "@2x.png";

      var humidity = document.createElement('div');
      humidity.textContent = ((data.daily[i].humidity) + "%");

      var wind = document.createElement('div');
      wind.textContent = ((data.daily[i].wind_speed) + " MPH");
      
      let dayInfo = document.createElement('td');
      

     
    
      
      dayInfo.appendChild(date);
      dayInfo.appendChild(icon);
      dayInfo.appendChild(temp);
      dayInfo.appendChild(humidity);
      dayInfo.appendChild(wind);

      dayInfoRow.appendChild(dayInfo);
    }



}

function renderSearches (){
  savedSearches.textContent = '';
  for (var i = 0; i < city.length; i++) {
    var cityEl = city[i];

    var button = document.createElement('button');
    button.textContent = cityEl;
    // button.setAttribute("btn btn-secondary");

    savedSearches.appendChild(button);
    button.className = "city-button";

  }
}

function getDateWithPostfix(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  } if (j == 3 && k != 13) {
    return i + "rd";
}
return i + "th";
}

function getFormattedDateString(datetime) {
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
return days[ datetime.getDay() ] + ' ' + getDateWithPostfix(datetime.getDate());
}



userFormEl.addEventListener('submit', formSubmitHandler);
savedSearches.addEventListener('click', savedSubmit);
