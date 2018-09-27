import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import FieldSet from 'flarum/components/FieldSet';
import Button from 'flarum/components/Button';

export default class GeotagCreateModal extends Modal {
    init() {
        this.textAreaObj = this.props.textAreaObj;
        this.loading = false;

        this.defaultLat = app.forum.data.attributes.defaultLat || 38.8977;
        this.defaultLong = app.forum.data.attributes.defaultLong || -77.0365;

        this.map = null;

        this.geotagData = {
            lat: m.prop(this.defaultLat),
            lng: m.prop(this.defaultLong)
        };

        this.geotag = app.store.createRecord('geotags');
    }

    className() {
        return 'GeotagCreateModal Modal--large';
    }

    title() {
        return app.translator.trans('reflar-geotags.forum.create_modal.default_title');
    }

    onhide() {
        this.map.setLocation(this.defaultLat, this.defaultLong)
    }

    onready() {
        $('#modal').on('shown.bs.modal', () => {
            this.loadLocationPicker()
        });
    }

    content() {
        return <div className="Modal-body">
            <div className="map-form-container">
                <form onsubmit={this.onsubmit.bind(this)}>
                    <div className="Map-field">
                        <div className="Form-group">
                            <label>{app.translator.trans('reflar-geotags.forum.create_modal.address_label')}</label>
                        </div>
                        <input type="hidden" data-type="location-store"/>

                        <div className="Map-container" style="margin: 10px 0;">
                            <div data-type="map" id="map" style="height: 400px; width: 100%;"/>
                        </div>
                    </div>

                    {FieldSet.component({
                        className: 'Map-coordinates',
                        label: app.translator.trans('reflar-geotags.forum.create_modal.coordinates_label') + ':',
                        children: [
                            <div className="Form-group">
                                <label>{app.translator.trans('reflar-geotags.forum.create_modal.latitude_label')}</label>
                                <input type="number" className="FormControl Map-coordinates-lat" type="number"
                                       value={this.geotagData.lat()}
                                       step="any"
                                       onchange={m.withAttr('value', this.updateLocation.bind(this, 'lat'))}/>
                            </div>,
                            <div className="Form-group">
                                <label>{app.translator.trans('reflar-geotags.forum.create_modal.longitude_label')}</label>
                                <input type="number" className="FormControl Map-coordinates-lng" type="number"
                                       value={this.geotagData.lng()}
                                       step="any"
                                       onchange={m.withAttr('value', this.updateLocation.bind(this, 'lng'))}/>
                            </div>
                        ],
                    })}

                    {FieldSet.component({
                        className: 'Buttons',
                        children: [
                            Button.component({
                                type: 'submit',
                                className: 'Button Button--primary',
                                children: app.translator.trans('reflar-geotags.forum.create_modal.save_button'),
                                loading: this.loading,
                                disabled: (this.geotagData.lng() === '' || this.geotagData.lat() === '')
                            }),
                            Button.component({
                                className: 'Button Map-address-locate',
                                icon: 'map-marker',
                                children: app.translator.trans('reflar-geotags.forum.create_modal.locate_button'),
                                onclick: this.getLocation.bind(this)
                            }),
                        ]
                    })}
                </form>
            </div>
        </div>
    }

    updateLocation(type, value) {
        if (type === 'lng') {
            this.geotagData.lng(value);
            this.map.setLocation(this.geotagData.lat(), value)
        } else if (type === 'lat') {
            this.geotagData.lat(value);
            this.map.setLocation(value, this.geotagData.lng())
        } else if (this.map) {
            var data = this.map.getData()
            this.geotagData.lat(data.lat);
            this.geotagData.lng(data.long);
        }
        if (window.chrome && window.chrome.webstore) {
            m.redraw()
        }
    }

    getLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.geotagData.lat(position.coords.latitude);
                this.geotagData.lng(position.coords.longitude);
                this.map.setLocation(position.coords.latitude, position.coords.longitude);
                if (window.chrome && window.chrome.webstore) {
                    m.redraw()
                }
            });
        }
    }

    onsubmit(e) {
        e.preventDefault();
        if (this.loading) return;
        this.map.setLocation(this.geotagData.lat(), this.geotagData.lng())
        this.loading = true;

        this.geotag.pushAttributes({
            lat: this.geotagData.lat(),
            lng: this.geotagData.lng()
        });
        this.textAreaObj.geotags.push(this.geotag);
        this.loading = false;
        this.hide();
    }

    loadLocationPicker() {
        var mapField = $('.Map-field').find('.Map-field');

        if ($('#map.olMap').length === 0) {
            mapField.locationPicker({
                init: {
                    location: {
                        latitude: this.geotagData.lat(),
                        longitude: this.geotagData.lng()
                    },
                },
                locationChanged: this.updateLocation.bind(this)
            })
            this.map = mapField;
        }
    }
}