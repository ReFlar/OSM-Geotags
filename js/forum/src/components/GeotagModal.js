import Modal from 'flarum/components/Modal';

export default class GeotagModal extends Modal {
    init() {
        this.geotag = this.props.geotag;
    }

    className() {
        return 'GeotagModal Modal--large';
    }

    title() {
        return this.geotag.lat() + '°, ' + this.geotag.lat() + '°';
    }

    content() {
        return [
            m('div', {className: 'Modal-body'}, [
                m('div', {
                    className: 'Map-field',
                    id: 'map',
                    style: {'width': '100%', 'height': '400px'},
                    config: this.loadMap.bind(this)
                })
            ])
        ]
    }

    loadMap(element) {
        var mapField = $(element)

        if (mapField.hasClass('olMap')) return;

        var map = new OpenLayers.Map($(element).attr('id'));
        map.addLayer(new OpenLayers.Layer.OSM());

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        var iconSize = new OpenLayers.Size(32, 32);
        var markerIcon = new OpenLayers.Icon('https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-128.png', iconSize, new OpenLayers.Pixel(-(iconSize.w / 2), -iconSize.h));

        var latLong = new OpenLayers.LonLat(this.geotag.lng(), this.geotag.lat()).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
        );
        markers.addMarker(new OpenLayers.Marker(latLong, markerIcon));
        map.setCenter(latLong, 12);
    }
}