import Modal from 'flarum/components/Modal';

export default class GeotagModal extends Modal {
    init() {
    }

    className() {
        return 'GeotagModal Modal--large';
    }

    title() {
        return app.translator.trans('reflar-geotags.forum.view_modal.title');
    }

    onready() {
        this.geotags = this.props.geotags;
        if (m.route().includes('/t/') || this.geotags.length > 1 || (typeof InstallTrigger !== 'undefined' && this.props.wait !== true) || this.props.wait === false) {
            $('#modal').on('shown.bs.modal', () => {
                this.loadMap()
            })
        } else {
            this.loadMap()
        }
    }

    onhide() {
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

    loadMap() {
        var mapField = $('.Map-field')

        if (mapField.hasClass('olMap') || this.geotags === null) return;

        var map = new OpenLayers.Map(mapField.attr('id'));
        map.addLayer(new OpenLayers.Layer.OSM.HOT('HOT'));

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        var iconSize = new OpenLayers.Size(32, 32);

        this.geotags.map(geotag => {
            var color = 'D94B43';
            var icon = 'fa-circle';
            if (app.session.user && app.session.user.id() == geotag.userId()) {
                icon = 'fa-star';
            }
            if (geotag.markerColor()) {
                color = geotag.markerColor().replace('#', '');
            }
            var markerUrl = `https://cdn.mapmarker.io/api/v1/pin?icon=${icon}&background=${color}&size=50`;

            var latLong = new OpenLayers.LonLat(geotag.lng(), geotag.lat()).transform(
                new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                map.getProjectionObject() // to Spherical Mercator Projection
            );
            var marker = new OpenLayers.Marker(latLong, new OpenLayers.Icon(markerUrl, iconSize, new OpenLayers.Pixel(-(iconSize.w / 2), -iconSize.h)));

            marker.events.register('click', marker, () => {
                    m.route(app.route.discussion(app.store.getById('discussions', geotag.discussionId())));
                });

            markers.addMarker(marker);
        });
        map.zoomToExtent(markers.getDataExtent());
        this.geotags = null;
    }
}
