var lang = window.navigator.language;

// Default Language
var lang = "en";

var weatherParams = {
    'q':'New York,US',
    'units':'imperial',
    'lang':lang,
    'weatherRefresh':600000,
    'forecastRefresh': 18000000,
    'APPID':'75a3ed05c383bac38e5bf285239ff0ac' // YOUR_FREE_OPENWEATHER_API_KEY
};

var messages = {
	'show': true,
	'refresh': 60000,
	'data': [
		'Hello, There!',
		'Hey Sexy!',
		'You, Look like the spouse I always dreamed of',
		'Hey..... You!',
		'Looking like a winner today',
		'Enjoy your day!'
	]
};

var newsfeed = {
	'show': true,
	'url': 'http://rss.cnn.com/rss/cnn_topstories.rss',
	'limit': 10,
	'refresh': 20000
};

var icalFeed = {
	'show': true,
	'limit': 10,
	'url': 'https://www.google.com/calendar/ical/t1gannlrafnvmr235st0aeks4lrmarnp%40import.calendar.google.com/public/basic.ics',
	'refresh': 600000
};