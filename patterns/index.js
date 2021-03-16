const patternDict = [{

	pattern: '\\b(Hi|Hello|Hey)\\b', 
	intent: 'Hello'
	},

	{
	pattern:'\\b(bye|exit)\\b',
	intent: 'Exit' 
	},

	{
	pattern:'Temperature\\s(?<city>.+)',
	intent: 'CurrentWeather' 
	},

	{
	pattern:'how is the weather in\\s(?<city>.+)',
	intent: 'CurrentWeather' 
	},

	{
  	pattern: '\\b(?<weather>hot|cold|rain|rainy|sunny|storm|snow|thunderstroms|windy|drizzle|cloudy|clear)\\s\\bin\\s\\b(?<city>.+)\\s\\b(?<time>aftertomrrow|tomorrow|today)$',
  	intent: 'WeatherForecast'
	}

];

module.exports = patternDict;