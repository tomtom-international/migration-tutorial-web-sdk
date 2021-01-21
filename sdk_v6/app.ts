import { default as ttm } from './web-sdk-maps/index';
import { default as tts } from './web-sdk-services/index';


var map = ttm.map({
  key: "YOUR_API_KEY",
  container: "map",
  center: [-122.478468, 37.769167],
  zoom: 15
});

map.addControl(new ttm.FullscreenControl());
map.addControl(new ttm.NavigationControl());

//traffic
map.on('load', function(): void {
  map.showTrafficFlow();
  map.showTrafficIncidents();
});

//marker
var marker = new ttm.Marker().setLngLat([-122.492544, 37.768454])
.addTo(map);

marker.setPopup(new ttm.Popup().setHTML("test"));

//routing
tts.services.calculateRoute({
      key: 'YOUR_API_KEY',
      locations: '-122.510601,37.768014:-122.478468,37.769167'
  })
  .then(function(response: tts.CalculateRouteResponse) {
      var geojson = response.toGeoJson();
      map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': {
              'type': 'geojson',
              'data': geojson
          },
          'paint': {
              'line-color': '#00d7ff',
              'line-width': 8
          }
      });
      var bounds = new ttm.LngLatBounds();
      geojson.features[0].geometry.coordinates.forEach(function(point: ttm.LngLatLike) {
          bounds.extend(ttm.LngLat.convert(point));
      });
      map.fitBounds(bounds, {padding: 20});
  });
new ttm.Marker().setLngLat([-122.478468,37.769167]).addTo(map);
new ttm.Marker().setLngLat([-122.510601,37.768014]).addTo(map);

//search
tts.services.fuzzySearch({
  key: 'YOUR_API_KEY',
  query: 'Golden Gate Golf Course San Francisco'
})
.then(function(response: tts.SearchResponse) {
  if (response && response.results) {
  for (var i = 0; i < response.results.length; i++) {
    new ttm.Marker().setLngLat(response.results[i].position as ttm.LngLatLike).addTo(map);
  }
}
});