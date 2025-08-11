# nearme.lml.live

Source code for <https://nearme.lml.live>. The website shows a listing of all
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
* `radius`: only gigs within this radius are included. Units are in meters. Defaults to 5,000m.
* `location`: the location to pass to the LML API. Defaults to "melbourne".

You can get the latitude and longitude for a location by looking it up on
Google maps. Once you have those, you just need to plug the values into the URL
above, and make a QR code for the URL.

## Dependencies

The website is built with Jekyll since it works natively with Github pages.
If you want to hack on it, you'll need Ruby and Bundler installed.

## Usage

If you're starting from a fresh clone of the repository, you'll first need to
install the gems.

```
bundle install
```

You can then build the site with `bundle exec jekyll build`, and run a local
development site with `bundle exec jekyll serve`. For more details, see the
[Jekyll documentation](https://jekyllrb.com/docs/).

## On-the-spot programming

To facilitate printing QR codes in advance for locations that are not yet
known, you can create predefined GUIDs in the `_data/locations.yml` file which
map to a given latitude and longitude. Each entry in this file is a hash of
the form:

```yaml
- guid: {guid}
  lat: {lat}
  lng: {lng}
```

On building the website, a redirect for every entry in this list is created
such that navigating to `https://nearme.lml.live/location/{guid}` will
automatically redirect to the specified latitude and longitude. The following
snippet will generate a suitable GUID.

```
ruby -r 'securerandom' -e 'puts SecureRandom.uuid'
```

With this facility you can print out a bunch of QR codes in advance, walk into
a cafe with your laptop, and program it then and there to create a personalised
gig guide on-the-spot! How cool!
