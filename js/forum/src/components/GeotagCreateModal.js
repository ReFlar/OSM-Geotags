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
        return [
            m('div', {className: 'Modal-body'}, [
                m('div', {className: 'map-form-container'}, [
                    m('form', {onsubmit: this.onsubmit.bind(this)}, [
                        m('div', {className: 'Form-group'}, [
                            m('label', {}, app.translator.trans('reflar-geotags.forum.create_modal.address_label')),
                        ]),
                        m('div', {
                            className: 'Map-field',
                        }, [
                            m('input', {
                                'data-type': 'address',
                                className: 'FormControl Map-address-search'
                            }),
                            m('input', {
                                type: 'hidden',
                                'data-type': 'location-store'
                            }),
                            m('div', {
                                className: 'Map-container',
                                style: 'margin-top: 10px;'
                            }, [
                                m('div', {
                                    'data-type': 'map',
                                    id: 'map',
                                    style: "height: 400px; width: 100%;"
                                })
                            ])
                        ]),
                        FieldSet.component({
                            className: 'Map-coordinates',
                            label: app.translator.trans('reflar-geotags.forum.create_modal.coordinates_label') + ':',
                            children: [
                                m('div', {className: 'Form-group'}, [
                                    m('label', {}, app.translator.trans('reflar-geotags.forum.create_modal.latitude_label')),
                                    m('input', {
                                        className: 'FormControl Map-coordinates-lat',
                                        value: this.geotagData.lat(),
                                        type: 'number',
                                        step: '0.00000001',
                                        oninput: m.withAttr('value', this.updateLocation.bind(this, 'lat'))
                                    })
                                ]),
                                m('div', {className: 'Form-group'}, [
                                    m('label', {}, app.translator.trans('reflar-geotags.forum.create_modal.longitude_label')),
                                    m('input', {
                                        className: 'FormControl Map-coordinates-lng',
                                        value: this.geotagData.lng(),
                                        type: 'number',
                                        step: '0.00000001',
                                        oninput: m.withAttr('value', this.updateLocation.bind(this, 'lng'))
                                    })
                                ]),
                            ]
                        }),
                        FieldSet.component({
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
                        }),
                    ])
                ])
            ])
        ]
    }

    updateLocation(type, value) {
        let parent = this;
        if (type === 'lng') {
            parent.geotagData.lng(value)
            parent.mapField.setLocation(parent.geotagData.lat(), value)
        } else {
            parent.geotagData.lat(value)
            parent.mapField.setLocation(value, parent.geotagData.lng())
        }
    }

    getLocation() {
        let parent = this;
        let picker = parent.mapField;
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                m.startComputation();
                parent.geotagData.lat(position.coords.latitude);
                parent.geotagData.lng(position.coords.longitude);
                picker.setLocation(position.coords.latitude, position.coords.longitude);
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
        let parent = this;

        parent.mapField = $(element).find('.Map-field');

        $('#modal').on('shown.bs.modal', function () {
            if ($('#map.olMap').length === 0) {
                parent.mapField.locationPicker({
                    init: {
                        location: {latitude: parent.geotagData.lat(), longitude: parent.geotagData.lng()},
                    },
                    locationChanged: (currentLocation => {
                        parent.geotagData.lat(currentLocation.location.latitude !== undefined ? currentLocation.location.latitude : parent.geotagData.lat());
                        parent.geotagData.lng(currentLocation.location.longitude !== undefined ? currentLocation.location.longitude : parent.geotagData.lng());
                        m.redraw();
                    })
                });
            }
        });
    }
}