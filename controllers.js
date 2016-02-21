var app = angular.module('mirrorApp', ['ngResource', 'angularMoment', 'ngAnimate']);


jQuery.fn.updateWithText = function(text, speed) {
	if($(this).html() != $('<div/>').html(text)) {
		$(this).fadeOut(speed/2, function(){
			$(this).html(text);
			$(this).fadeIn(speed/2, function(){});
		});
	}
};

function calCtrl($scope, $timeout) {
	var cal = function() {
		console.log("Getting calendar data.");
		new ical_parser('http://localhost:8080/proxy?url='+icalFeed.url, function(raw_cal){
			var raw_events = raw_cal.getEvents();
			$scope.events = [];
			for(var i = 0; i < raw_events.length; i++) {
				raw_events[i]['timestamp'] = new Date(Date.parse(raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(0, 4)+ '-' +
					raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(4, 8)+'-'+
					raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(6, 8)+
					raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(8, 11)+':'+
					raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(11, 13)+':'+
					raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(13, 16)));
				if(raw_events[i]['timestamp'] > new Date(Date.now())) {
					$scope.events.push(raw_events[i]);
				}
			}
		});
		$timeout(cal, icalFeed.refresh);
	};
	cal();
}

function messageCtrl($scope, $timeout) {
	$scope.messagesShow = messages.show;
	$scope.message = messages.data[0];
	$scope.lastmessage = $scope.message;

	var messageSwtich = function() {
		console.log("Switching message");


		while($scope.message === $scope.lastmessage) {
			$scope.message = messages.data[Math.floor(Math.random()*messages.data.length)];
		}

		$('.message').updateWithText($scope.message, 4000);
		$scope.lastmessage = $scope.message;
		$timeout(messageSwtich, messages.refresh);
	};
	messageSwtich();
}

// Getting news updates
function newsCtrl($scope, $resource, $timeout) {
	$scope.news = $resource('http://ajax.googleapis.com/ajax/services/feed/load',
		{q: newsfeed.url, num: newsfeed.limit, callback: 'JSON_CALLBACK', v: '1.0'},
		{get: {method:'JSONP'}});
	$scope.newsfeedShow = newsfeed.show;

	var getHeadlines = function() {
		console.log("Getting headlines from" + newsfeed.url);
		$scope.newsIndex = 0;
		if(newsfeed.show) {
			$scope.news.get(function(currNews) {
				var newsSwtich = function() {
					console.log("Swtiching Headlines");
					if(currNews.responseData.feed.entries[$scope.newsIndex] !== undefined) {
						$('.news').updateWithText(currNews.responseData.feed.entries[$scope.newsIndex].title, 4000);
						$scope.newsIndex++;
						$timeout(newsSwtich, newsfeed.refresh);
					}
					else {
						$timeout(getHeadlines, newsfeed.refresh);
					}
				};
				newsSwtich();
			});
		}
		else {
			$timeout(getHeadlines, newsfeed.refresh);
		}
	};
	getHeadlines();
}

function dateCtrl($scope) {
	setInterval(function(){
		$scope.$apply(function(){
			$scope.currDate = new Date();
		});
	}, 1000);
}

function WeatherCtrl($scope, $resource, $timeout) {
	$scope.weather = $resource('http://api.openweathermap.org/data/2.5/weather?q=NewYork,us&appid=44db6a862fba0b067b1930da0d769e98',
		{action: 'weather', q: weatherParams.q, units: weatherParams.units, lang: weatherParams.lang, callback: 'JSON_CALLBACK'},
		{get:{method: 'JSONP'}});

	var currWeather = function() {
		console.log("Getting current weather");
		$scope.weather.get({action: 'weather'}, function(weatherNow){
			var now = new Date();

			// Scoping for weather data
			$scope.weatherNow = weatherNow;

			$scope.weatherNow.sun = {};
			if(weatherNow.sys.sunrise*1000 < now && weatherNow.sys.sunset*1000 > now) {
				$scope.weatherNow.sun.nextStatus = 'set';
				$scope.weatherNow.sun.nextStatusTime = weatherNow.sys.sunset;
			}
			else {
				$scope.weatherNow.sun.nextStatus = 'rise';
				$scope.weatherNow.sun.nextStatusTime = weatherNow.sys.sunrise;
			}
		});
		$timeout(currWeather, weatherParams.weatherRefresh);
	};
	currWeather();

	var forecast = function() {
		console.log("Getting weather forecast");
		$scope.weather.get({action: 'forecast'}, function(weatherForecast){
			$scope.weatherForecast = {};
			for(var i in weatherForecast.list) {
				var forecast = weatherForecast.list[i];
				var dateKey = forecast.dt_txt.substring(0, 10);

				if($scope.weatherForecast[dateKey] === undefined) {
					$scope.weatherForecast[dateKey] = {
						'timestamp': forecast.dt * 1000,
						'time_min': forecast.main.temp,
						'temp_max': forecast.main.temp,
						'icon': forecast.weather[0].icon,
					};
				}
				else {
					$scope.weatherForecast[dateKey]['temp_min'] = (forecast.main.temp < $scope.weatherForecast[dateKey]['temp_min']) ? forecast.main.temp : $scope.weatherForecast[dateKey]['temp_min'];
					$scope.weatherForecast[dateKey]['temp_max'] = (forecast.main.temp > $scope.weatherForecast[dateKey]['temp_max']) ? forecast.main.temp : $scope.weatherForecast[dateKey]['temp_max'];
					if(forecast.dt_txt.substring(11, 19) === '12:00:00') {
						$scope.weatherForecast[dateKey]['icon'] = forecast.weather[0].icon;
					}
				}
			}
		});
		$timeout(forecast, weatherParams.forecastRefresh);
	};
	forecast();
}

// Getting Twitter Data
function getTweets() {
	$http.get(baseURL + 'tweets')
		.success(function(tweets){
			$scope.tweets = tweets;
			setTweet();
		})

		.error(function(error){
			console.error(error);
		});
}

function setTweet() {
	angular.element(document.getElementById("tweet")).removeClass("slideInRight").addClass("slideOutLeft");
	$scope.tweet = $scope.tweets.splice(0, 1)[0];
	$timeout(function(){
		angular.element(docment.getElementById("tweet")).removeClass("slideOutLeft").addClass("slideInRight");
	}, 1000);
}