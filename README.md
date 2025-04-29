# nearme.lml.live

Source code for <https://nearme.lml.live>. It's used to show a listing of all
nearby gigs for a given set of coordinates. The intended purpose is for making
QR codes to put in restaurants/cafes/bars which let people see what's on
nearby.

You can specify where you want to search using the query parameters of
the URL. The URL is of the form:

```
https://nearme.lml.live?lat=<lat>&lng=<lng>&radius=<radius>&location=<loc>
```

* `lat`: latitude of the coordinate. Defaults to the corner of Johnston St and Brunswick St, Fitzroy.
* `lng`: longitude of the coordinate. Defaults to the corner of Johnston St and Brunswick St, Fitzroy.
* `radius`: only gigs within this radius are included. Defaults to 5km.
* `location`: the location to pass to the LML API. Defaults to "melbourne".

You can get the latitude and longitude for a location by looking it up on
Google maps. Once you have those, you just need to plug the values into the URL
above, and make a QR code for the URL.
