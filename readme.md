# Geotags by ReFlar

A [Flarum](http://flarum.org) extension that adds places for your posts (with editor button, list of places on each post and markdown string with name of place in text).
Uses [Open Steet Mao Location Picker](https://github.com/CDK2020/OSM-locationpicker).

### Screenshots

Editor button:  
![Imgur](https://i.imgur.com/4qruHNn.png)  
Creation modal:  
![Imgur](https://i.imgur.com/0wCkNcl.png)  
Result of creation in text editor:  
![Imgur](https://i.imgur.com/iE2icvn.png)  
...and in post:  
![Imgur](https://i.imgur.com/8duv1iQ.png)  
...and after clicking on it:  
![Imgur](https://i.imgur.com/548kmnW.png)  

### Goals

- Allow users mention places and show them on map.

### Installation

```bash
composer require reflar/geotags
```

### Configuration

- [Create](https://console.developers.google.com/) Google Maps API-key.
- Enable Google Maps JavaScript API, Google Places API Web Service and Google Maps Geocoding API for full functionality.
- Add your domain to accepted list.
- Open settings modal of the extension in your admin panel and save Google API-key.

## End-user usage

During post creation (or post editing or discussion creating) click the "Edit places" button. In creation modal drag marker (or search in "Address" field or enter coordinates) and save new location.

### Links

- [Github](https://github.com/reflar/osm-geotags)
