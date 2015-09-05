
This project is a simplest illustration of usage Node.js and two APIs: [OpenWeather](http://openweathermap.org/api) and [Google Maps](https://developers.google.com/maps/).

##Usage
To run project locally, you need Node.js installed. See more on [Node.js](http://nodejs.org) website, then:

1. Clone this repository;
2. Run
`npm install`
from directory with your cloned repo to install all project dependencies;
3. Run project by typing `gulp`;
4. See console output and make sure, that your node.js application using port `8080`. Then head to `http://localhost:8080`.

##Warning
Sometimes, search engine may give you a strange results. 

For example, search request 'Kiev' will give you 'Pushcha-Voditsa, UA' result, 'Moscow' => 'Moskovskaya Oblast’, RU', 'Rome' => 'Trevi, IT' etc.

It happens, because OpenWeather API, before giving you results, receives geographic coordinates of the requested places, but not their names.
