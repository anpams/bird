Small webapp that shows the most recent notable bird observation in the user's* location (*ip geolocation) 

It uses the following APIs:
- [ipGeolocation](https://ipgeolocation.io/) To detect the location (it can get blocked if the user has a few privacy browser extensions)
- [eBird](https://documenter.getpostman.com/view/664302/S1ENwy59) To detect the most recent notable observation by location (bird name)
- [Xeno-Canto](https://xeno-canto.org/article/153) To return a recording of the bird
- [Wikipedia](https://www.mediawiki.org/wiki/API:Main_page) Firt looks for the wikipedia article by scientific name. Then returns the thumbnail picture of the article
  
It has programmed using only vanilla JS and coded everything in the frontend. This is by design. Unfortunatelly this means I couldn't keep the API keys in an .env file

*Future work: Do the search by allowing the user to enter a city or postal code instead of using IP geolocation. FAQ.

