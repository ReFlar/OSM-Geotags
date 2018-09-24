import Modal from 'flarum/components/Modal';

export default class GeotagModal extends Modal {
    init() {
        this.geotags = this.props.geotags;
    }

    className() {
        return 'GeotagModal Modal--large';
    }

    title() {
        return app.translator.trans('reflar-geotags.ref.geotags');
    }

    onready() {
        this.loadMap()
    }

    onhide(){
        $('.Map-field').remove()
    }

    content() {
        return [
            m('div', {className: 'Modal-body'}, [
                m('div', {
                    className: 'Map-field',
                    id: 'map',
                    style: {'width': '100%', 'height': '400px'}
                })
            ])
        ]
    }

    loadMap(element) {
        $('#modal').on('shown.bs.modal', () => {
            var mapField = $('.Map-field')

            if (mapField.hasClass('olMap') || this.geotags === null) return;

            var map = new OpenLayers.Map(mapField.attr('id'));
            map.addLayer(new OpenLayers.Layer.OSM());

            var markers = new OpenLayers.Layer.Markers("Markers");
            map.addLayer(markers);
            var iconSize = new OpenLayers.Size(32, 32);

            this.geotags.map(geotag => {
                var latLong = new OpenLayers.LonLat(geotag.lng(), geotag.lat()).transform(
                    new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                    map.getProjectionObject() // to Spherical Mercator Projection
                );
                markers.addMarker(new OpenLayers.Marker(latLong, new OpenLayers.Icon('https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-128.png', iconSize, new OpenLayers.Pixel(-(iconSize.w / 2), -iconSize.h))));
            });
            map.zoomToExtent(markers.getDataExtent());
            console.log(markers)
            this.geotags = null;
        });
    }
}
