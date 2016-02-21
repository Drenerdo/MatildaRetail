/*
 * Weather widget using GeoLocation API and OpenWeather API
 * @author Arindam Chattopadhya
 * @2/20/2015
 */

//define the global variables
//current weather URL
var BASE_URL = "http://api.openweathermap.org/data/2.5/weather?";
var UrlParams = "&APPID=514ec842f4fe3436218d919b650c83b4&units=imperial&type=accurate&mode=json";
// forecast URL
var Forecast_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?";
var ForeCast_Params = "&APPID=514ec842f4fe3436218d919b650c83b4&cnt=7&units=imperial&type=accurate&mode=json";
// Image base URL
var IMG_URL = "http://openweathermap.org/img/w/";
var d = new Date();
var CURRENT_DAY =  d.getDay();
/* Initial function call to determine the user location using GeoLocation API */
function getLocation() {
	if (navigator.geolocation) {
		var timeoutVal = 10 * 1000 * 1000;
		navigator.geolocation.getCurrentPosition(getCurrentWeatherData,
				displayError, {
					enableHighAccuracy : true,
					timeout : timeoutVal,
					maximumAge : 0
				});
	} else {
		alert("Geolocation is not supported by this browser");
	}
}
var _lat,_long;
function initMap() {
  console.log(_lat,_long);
  if(!_lat || _lat == undefined)
  {
  	return;
  }
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: _lat, lng: _long}
  });

  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);
}
// get the Current Weather for User location
function getCurrentWeatherData(position) {
	// Build the OpenAPI URL for current Weather
	_lat = position.coords.latitude;
	_long = position.coords.longitude;
	initMap();
	var WeatherNowAPIurl = BASE_URL + "lat=" + position.coords.latitude
			+ "&lon=" + position.coords.longitude + UrlParams;
	var WeatherForecast_url = Forecast_URL + "lat=" + position.coords.latitude
			+ "&lon=" + position.coords.longitude + ForeCast_Params;
	// OpenWeather API call for Current Weather
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var JSONobj = JSON.parse(xmlhttp.responseText);
			Parse(JSONobj);
		}
	}
	xmlhttp.open("GET", WeatherNowAPIurl, true);
	xmlhttp.send();

	// OpenWeather API call for Forecast Weather
	var xmlhr = new XMLHttpRequest();
	xmlhr.onreadystatechange = function() {
		if (xmlhr.readyState == 4 && xmlhr.status == 200) {
			var JSobj = JSON.parse(xmlhr.responseText);
			Forecast(JSobj);
		}
	}
	xmlhr.open("GET", WeatherForecast_url, true);
	xmlhr.send();

}
// Error Handler
function displayError(error) {
	var errors = {
		1 : 'Permission denied',
		2 : 'Position unavailable',
		3 : 'Request timeout'
	};
	alert("Error: " + errors[error.code]);
}
// display the current weather and location
weather_icons = {
	"01d":"wi-day-sunny",
	"02d":"wi-day-cloudy-gusts",
	"03d":"wi-day-cloudy",
	"04d":"wi-day-hail",
	"09d":"wi-day-showers",
	"10d":"wi-day-rain",
	"11d":"wi-day-thunderstorm",
	"13d":"wi-day-snow",
	"50d":"wi-day-fog",
	"01n":"wi-night-clear",
	"02n":"wi-night-alt-cloudy-gusts",
	"03n":"wi-night-alt-cloudy",
	"04n":"wi-night-alt-hail",
	"09n":"wi-night-alt-showers",
	"10n":"wi-night-alt-rain",
	"11n":"wi-night-alt-thunderstorm",
	"13n":"wi-night-alt-snow",
	"50n":"wi-night-fog",
}
function Parse(obj) {
	// current weather
	document.getElementById("todayWeatherIcon").innerHTML = "<i class='wi "+
				weather_icons[obj.weather[0].icon] +"'></i>";
	document.getElementById("todayTempMax").innerHTML =
			 obj.main.temp_max.toFixed(0) +"<sup>0</sup>F";
    document.getElementById("todayTempMin").innerHTML =
			 obj.main.temp_min.toFixed(0)+"<sup>0</sup>F";
    document.getElementById("todayWeatherDescription").innerHTML =
			 obj.weather[0].description.toLowerCase().split("sky is clear").join("Clear Skies")
			 .split("clear sky").join("Clear Skies") + "<br>" + 
			 "<span id='todayWeatherMain'>" + obj.weather[0].main + "<span>";

}
var week = ['sun','mon','tue','wed','thu','fri','sat','sun'];
// display forecasts for next 7 Days

function Forecast(obj) {
	console.log(obj.list);
	for(i=0;i<6;i++)
	{		
		CURRENT_DAY++;
		CURRENT_DAY %= 7 ;
		document.getElementById("day"+(i+1)).innerHTML = "<i class='wi "+
				weather_icons[obj.list[i+1].weather[0].icon] +"'></i>" + "<br>"
				+ "<span class='week-day fontsforweb_fontid_12950'>" + week[CURRENT_DAY] + "</span><br>"
				+ "<span class='temp-max fontsforweb_fontid_12950'>" + obj.list[i+1].temp.max.toFixed(0) + "</span><br>"
				+ "<span class='temp-min fontsforweb_fontid_12950'>" + obj.list[i+1].temp.min.toFixed(0) + "</span><br>"
				+ "<span class='wdescription fontsforweb_fontid_12950'>" + obj.list[i+1].weather[0].description.
				toLowerCase().split("sky is clear").join("Clear Skies").split("clear sky")
				.join("Clear Skies") + "</span>";
		
	}
	
	}