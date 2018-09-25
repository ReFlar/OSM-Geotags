import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import FieldSet from 'flarum/components/FieldSet';
import Button from 'flarum/components/Button';

export default class GeotagCreateModal extends Modal {
    init() {
        this.textAreaObj = this.props.textAreaObj;
        this.loading = false;
        this.mapField = null;

        this.geotagData = {
            lat: m.prop(38.8977),
            lng: m.prop(-77.0365)
        };

        this.geotag = app.store.createRecord('geotags');
    }

    className() {
        return 'GeotagCreateModal Modal--large';
    }

    title() {
        return app.translator.trans('reflar-geotags.forum.create_modal.default_title');
    }

    onready() {
        this.loadLocationPicker()
    }

    content() {
        return <div className="Modal-body">
            <div className="map-form-container">
                <form onsubmit={this.onsubmit.bind(this)}>
                    <div className="Map-field">
                        <div className="Form-group">
                            <label>{app.translator.trans('reflar-geotags.forum.create_modal.address_label')}</label>
                        </div>
                        <input type="hidden" data-type="location-store" />

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
            this.mapField.setLocation(this.geotagData.lat(), value)
        } else {
            this.geotagData.lat(value);
            this.mapField.setLocation(value, this.geotagData.lng())
        }

        m.redraw();
    }

    getLocation() {
        if('geolocation' in navigator) {
            m.startComputation();
            navigator.geolocation.getCurrentPosition(position => {
                this.geotagData.lat(position.coords.latitude);
                this.geotagData.lng(position.coords.longitude);
                this.mapField.setLocation(position.coords.latitude, position.coords.longitude);
                m.endComputation();
            });
        }
    }

    onsubmit(e) {
        e.preventDefault();
        if (this.loading) return;
        this.loading = true;

        this.geotag.pushAttributes({
            lat: this.geotagData.lat(),
            lng: this.geotagData.lng()
        });
        this.textAreaObj.geotags.push(this.geotag);
        this.loading = false;
        this.hide();
    }

    loadLocationPicker(element) {
        this.mapField = $(element).find('.Map-field');

        $('#modal').on('shown.bs.modal', () => {
            if ($('#map.olMap').length === 0) {
                this.mapField.locationPicker({
                    init: {
                        location: {
                            latitude: this.geotagData.lat(),
                            longitude: this.geotagData.lng()
                        },
                    },
                    locationChanged: (location => {
                        this.geotagData.lat(location.lat !== undefined ? location.lat : this.geotagData.lat());
                        this.geotagData.lng(location.long !== undefined ? location.long : this.geotagData.lng());
                        m.redraw();
                    })
                });
            }
        });
    }
}