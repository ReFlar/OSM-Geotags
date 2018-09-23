$.fn.locationPicker = function(options) {

    var $this = this
    var settings = $.extend({
        address_el: 'input[data-type="address"]',
        map_el: '[data-type="map"]',
        save_el: '[data-type="location-store"]',
        raw_data: false,
        init: {
            current_location: true
        }
    }, options)

    var data = {}

    var txtAddress = $(settings.address_el)
    var mapEl = $(settings.map_el)
    var saveEl = $(settings.save_el)
    var init_zoom = 12
    var zoom = null
    var icon_url = 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-128.png' //'/img/marker-icon.png'

    var createMarkerIcon = function() {
        var iconSize = new OpenLayers.Size(32, 32)
        var iconOffset = new OpenLayers.Pixel(-(iconSize.w / 2), -iconSize.h)
        var icon = new OpenLayers.Icon(icon_url, iconSize, iconOffset)

        return icon
    }

    var markerIcon = createMarkerIcon()

    var generateRandId = function() {
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        var id = randLetter + Date.now()
        return id
    }

    var clear = function() {
        data = {}
        markers.clearMarkers()
        saveData()

        onLocationChanged()
    }

    var saveData = function() {
        if (saveEl.length > 0) {
            saveEl.val(JSON.stringify(data))
        }
    }

    var readPlace = function(place) {
            var result = {
                address: place.formatted_address,
                location: {
                    lat: place.geometry.location.lat(),
                    long: place.geometry.location.lng()
                }
            }

            if (settings.raw_data) {
                data.raw = place
            }

            return result
        }
        /* Open Street Map config */
    var setMapLocation = function(lat, long, centerMap) {

        if (centerMap === undefined) centerMap = true

        setAddressInternal({
            location: new google.maps.LatLng(lat, long)
        })

        var latLong = new OpenLayers.LonLat(long, lat).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
        )

        if (!zoom) {
            zoom = init_zoom
        } else {
            zoom = map.getZoom()
        }

        if (centerMap) {
            map.setCenter(latLong, zoom)
        }

        marker = new OpenLayers.Marker(latLong, markerIcon)

        markers.clearMarkers()
        markers.addMarker(marker)
    }

    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },

        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions)
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            )
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger
                }, this.handlerOptions
            )
        },

        trigger: function(e) {
            var latLong = map.getLonLatFromPixel(e.xy).transform(
                    map.getProjectionObject(),
                    new OpenLayers.Projection("EPSG:4326")) // transform to WGS 1984

            data = {
                location: {
                    lat: latLong.lat,
                    long: latLong.lon
                }
            }

            // TODO init map with reverse geocode
            geoCoder.geocode({
                location: new google.maps.LatLng(latLong.lat, latLong.lon)
            }, function(result, status) {
                if (status == 'OK') {
                    data = readPlace(result[0])
                }

                setMapLocation(data.location.lat, data.location.long, false)
                onLocationChanged()
            })
        }

    })

    var mapId = mapEl.attr('id')
    if (!mapId) {
        mapEl.attr('id', generateRandId())
    }

    var map = new OpenLayers.Map(mapEl.attr('id'))
    map.addLayer(new OpenLayers.Layer.OSM())

    var markers = new OpenLayers.Layer.Markers("Markers")
    map.addLayer(markers)

    var click = new OpenLayers.Control.Click()
    map.addControl(click)
    click.activate()

    var marker = null


    /* Google maps config */
    geoCoder = new google.maps.Geocoder()

    var autocomplete = new google.maps.places.Autocomplete(
        txtAddress[0], {
            types: ['geocode']
        })


    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        place = autocomplete.getPlace()

        data = readPlace(place)
        setMapLocation(data.location.lat, data.location.long)
        onLocationChanged()
    })

    this.getData = function() {
        return data
    }

    this.getAddress = function() {
        return data.formatted_address
    }

    var setAddressInternal = function(args) {
        geoCoder.geocode(args, function(result, status) {
            if (status == 'OK') {
                if (result.length > 0) {
                    data = readPlace(result[0])

                    setMapLocation(data.location.lat, data.location.long)
                    onLocationChanged()

                } else {
                    clear()
                }
            }
        })
    }

    this.setAddress = function(address) {
        setAddressInternal({
            address: address
        })
    }

    this.setLocation = function(lat, long) {
        setAddressInternal({
            location: new google.maps.LatLng(lat, long)
        })
    }

    var init = function() {
        if (settings.init) {
            if (settings.init.current_location) {
                // set map to current location

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        setMapLocation(position.coords.latitude, position.coords.longitude)
                    }, function(error) {
                        // set map to default location
                        setMapLocation(49.8419505, 24.0315968)
                    })
                }
            } else if (settings.init.address) {
                $this.setAddress(settings.init.address)
            } else if (settings.init.location) {
                $this.setLocation(settings.init.location.latitude, settings.init.location.longitude)
            }
        }
    }

    var onLocationChanged = function() {

        if (data.address) {
            txtAddress.val(data.address)
        }

        saveData()

        if (settings.locationChanged) {
            settings.locationChanged(data)
        }
    }

    init()

    return this
};
'use strict';

System.register('reflar/geotags/addGeotagsList', ['flarum/extend', 'flarum/app', 'flarum/components/CommentPost', 'flarum/helpers/icon', 'flarum/helpers/punctuateSeries', 'reflar/geotags/models/Geotag', 'reflar/geotags/components/GeotagModal'], function (_export, _context) {
    "use strict";

    var extend, app, CommentPost, icon, punctuateSeries, Geotag, GeotagModal;

    _export('default', function () {
        extend(CommentPost.prototype, 'footerItems', function (items) {
            var post = this.props.post;
            var geotags = post.geotags();

            if (geotags && geotags.length) {
                var titles = geotags.map(function (geotag) {
                    if (geotag instanceof Geotag) {
                        return [m('a', {
                            href: '#',
                            onclick: function onclick(e) {
                                e.preventDefault();
                                app.modal.show(new GeotagModal({ geotag: geotag }));
                            }
                        }, geotag.lat() + '°, ' + geotag.lng() + '°')];
                    }
                });

                items.add('geotags', [m('div', { className: 'Post-geotags' }, [icon('map-marker'), app.translator.trans('reflar-geotags.forum.post.geotags_title') + ': ', punctuateSeries(titles)])]);
            }
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumHelpersPunctuateSeries) {
            punctuateSeries = _flarumHelpersPunctuateSeries.default;
        }, function (_reflarGeotagsModelsGeotag) {
            Geotag = _reflarGeotagsModelsGeotag.default;
        }, function (_reflarGeotagsComponentsGeotagModal) {
            GeotagModal = _reflarGeotagsComponentsGeotagModal.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('reflar/geotags/components/GeotagCreateModal', ['flarum/app', 'flarum/components/Modal', 'flarum/components/FieldSet', 'flarum/components/Button'], function (_export, _context) {
    "use strict";

    var app, Modal, FieldSet, Button, GeotagCreateModal;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsFieldSet) {
            FieldSet = _flarumComponentsFieldSet.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }],
        execute: function () {
            GeotagCreateModal = function (_Modal) {
                babelHelpers.inherits(GeotagCreateModal, _Modal);

                function GeotagCreateModal() {
                    babelHelpers.classCallCheck(this, GeotagCreateModal);
                    return babelHelpers.possibleConstructorReturn(this, (GeotagCreateModal.__proto__ || Object.getPrototypeOf(GeotagCreateModal)).apply(this, arguments));
                }

                babelHelpers.createClass(GeotagCreateModal, [{
                    key: 'init',
                    value: function init() {
                        this.textAreaObj = this.props.textAreaObj;
                        this.loading = false;
                        this.mapField = null;

                        this.geotagData = {
                            lat: m.prop(38.8977),
                            lng: m.prop(-77.0365)
                        };

                        this.geotag = app.store.createRecord('geotags');
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'GeotagCreateModal Modal--large';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('reflar-geotags.forum.create_modal.default_title');
                    }
                }, {
                    key: 'onready',
                    value: function onready() {
                        this.loadLocationPicker();
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        return [m('div', { className: 'Modal-body' }, [m('div', { className: 'map-form-container' }, [m('form', { onsubmit: this.onsubmit.bind(this) }, [m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('reflar-geotags.forum.create_modal.address_label'))]), m('div', {
                            className: 'Map-field'
                        }, [m('input', {
                            'data-type': 'address',
                            className: 'FormControl Map-address-search'
                        }), m('input', {
                            type: 'hidden',
                            'data-type': 'location-store'
                        }), m('div', {
                            className: 'Map-container',
                            style: 'margin-top: 10px;'
                        }, [m('div', {
                            'data-type': 'map',
                            id: 'map',
                            style: "height: 400px; width: 100%;"
                        })])]), FieldSet.component({
                            className: 'Map-coordinates',
                            label: app.translator.trans('reflar-geotags.forum.create_modal.coordinates_label') + ':',
                            children: [m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('reflar-geotags.forum.create_modal.latitude_label')), m('input', {
                                className: 'FormControl Map-coordinates-lat',
                                value: this.geotagData.lat(),
                                type: 'number',
                                step: '0.00000001',
                                oninput: m.withAttr('value', this.updateLocation.bind(this, 'lat'))
                            })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('reflar-geotags.forum.create_modal.longitude_label')), m('input', {
                                className: 'FormControl Map-coordinates-lng',
                                value: this.geotagData.lng(),
                                type: 'number',
                                step: '0.00000001',
                                oninput: m.withAttr('value', this.updateLocation.bind(this, 'lng'))
                            })])]
                        }), FieldSet.component({
                            className: 'Buttons',
                            children: [Button.component({
                                type: 'submit',
                                className: 'Button Button--primary',
                                children: app.translator.trans('reflar-geotags.forum.create_modal.save_button'),
                                loading: this.loading,
                                disabled: this.geotagData.lng() === '' || this.geotagData.lat() === ''
                            }), Button.component({
                                className: 'Button Map-address-locate',
                                icon: 'map-marker',
                                children: app.translator.trans('reflar-geotags.forum.create_modal.locate_button'),
                                onclick: this.getLocation.bind(this)
                            })]
                        })])])])];
                    }
                }, {
                    key: 'updateLocation',
                    value: function updateLocation(type, value) {
                        var parent = this;
                        if (type === 'lng') {
                            parent.geotagData.lng(value);
                            parent.mapField.setLocation(parent.geotagData.lat(), value);
                        } else {
                            parent.geotagData.lat(value);
                            parent.mapField.setLocation(value, parent.geotagData.lng());
                        }
                    }
                }, {
                    key: 'getLocation',
                    value: function getLocation() {
                        var parent = this;
                        var picker = parent.mapField;
                        if ('geolocation' in navigator) {
                            navigator.geolocation.getCurrentPosition(function (position) {
                                m.startComputation();
                                parent.geotagData.lat(position.coords.latitude);
                                parent.geotagData.lng(position.coords.longitude);
                                picker.setLocation(position.coords.latitude, position.coords.longitude);
                                m.endComputation();
                            });
                        }
                    }
                }, {
                    key: 'onsubmit',
                    value: function onsubmit(e) {
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
                }, {
                    key: 'loadLocationPicker',
                    value: function loadLocationPicker(element) {
                        var parent = this;

                        parent.mapField = $(element).find('.Map-field');

                        $('#modal').on('shown.bs.modal', function () {
                            if ($('#map.olMap').length === 0) {
                                parent.mapField.locationPicker({
                                    init: {
                                        location: { latitude: parent.geotagData.lat(), longitude: parent.geotagData.lng() }
                                    },
                                    locationChanged: function locationChanged(currentLocation) {
                                        parent.geotagData.lat(currentLocation.location.latitude !== undefined ? currentLocation.location.latitude : parent.geotagData.lat());
                                        parent.geotagData.lng(currentLocation.location.longitude !== undefined ? currentLocation.location.longitude : parent.geotagData.lng());
                                        m.redraw();
                                    }
                                });
                            }
                        });
                    }
                }]);
                return GeotagCreateModal;
            }(Modal);

            _export('default', GeotagCreateModal);
        }
    };
});;
'use strict';

System.register('reflar/geotags/components/GeotagListModal', ['flarum/app', 'flarum/components/Modal', 'flarum/components/Button', 'flarum/components/FieldSet', 'reflar/geotags/components/GeotagModal'], function (_export, _context) {
    "use strict";

    var app, Modal, Button, FieldSet, GeotagModal, GeotagListModal;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsFieldSet) {
            FieldSet = _flarumComponentsFieldSet.default;
        }, function (_reflarGeotagsComponentsGeotagModal) {
            GeotagModal = _reflarGeotagsComponentsGeotagModal.default;
        }],
        execute: function () {
            GeotagListModal = function (_Modal) {
                babelHelpers.inherits(GeotagListModal, _Modal);

                function GeotagListModal() {
                    babelHelpers.classCallCheck(this, GeotagListModal);
                    return babelHelpers.possibleConstructorReturn(this, (GeotagListModal.__proto__ || Object.getPrototypeOf(GeotagListModal)).apply(this, arguments));
                }

                babelHelpers.createClass(GeotagListModal, [{
                    key: 'init',
                    value: function init() {
                        this.textAreaObj = this.props.textAreaObj;
                        console.log(this.textAreaObj.geotags);
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'GeotagListModal Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('reflar-geotags.forum.list_modal.geotags_title');
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        var parent = this;
                        var geotags = parent.textAreaObj.geotags;

                        return [m('div', { className: 'Modal-body' }, [FieldSet.component({
                            className: 'Geotags-list',
                            label: app.translator.trans('reflar-geotags.forum.list_modal.geotags_list_title') + ':',
                            children: [geotags.map(function (geotag, i) {
                                return [m('li', { className: 'Geotags-item' }, [m('a', {
                                    href: '#',
                                    onclick: function onclick(e) {
                                        e.preventDefault();
                                        parent.hide();
                                        app.modal.show(new GeotagModal({ geotag: geotag }));
                                    }
                                }, geotag.lat() + '°, ' + geotag.lng() + '°'), Button.component({
                                    className: 'Button Button--icon Button--link',
                                    icon: 'times',
                                    title: app.translator.trans('reflar-geotags.forum.post.geotag_delete_tooltip'),
                                    onclick: function onclick() {
                                        geotags.splice(i, 1);
                                    }
                                })])];
                            })]
                        })])];
                    }
                }]);
                return GeotagListModal;
            }(Modal);

            _export('default', GeotagListModal);
        }
    };
});;
'use strict';

System.register('reflar/geotags/components/GeotagModal', ['flarum/components/Modal'], function (_export, _context) {
    "use strict";

    var Modal, GeotagModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }],
        execute: function () {
            GeotagModal = function (_Modal) {
                babelHelpers.inherits(GeotagModal, _Modal);

                function GeotagModal() {
                    babelHelpers.classCallCheck(this, GeotagModal);
                    return babelHelpers.possibleConstructorReturn(this, (GeotagModal.__proto__ || Object.getPrototypeOf(GeotagModal)).apply(this, arguments));
                }

                babelHelpers.createClass(GeotagModal, [{
                    key: 'init',
                    value: function init() {
                        this.geotag = this.props.geotag;
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'GeotagModal Modal--large';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return this.geotag.lat() + '°, ' + this.geotag.lat() + '°';
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        return [m('div', { className: 'Modal-body' }, [m('div', {
                            className: 'Map-field',
                            id: 'map',
                            style: { 'width': '100%', 'height': '400px' },
                            config: this.loadMap.bind(this)
                        })])];
                    }
                }, {
                    key: 'loadMap',
                    value: function loadMap(element) {
                        var mapField = $(element);

                        if (mapField.hasClass('olMap')) return;

                        var map = new OpenLayers.Map($(element).attr('id'));
                        map.addLayer(new OpenLayers.Layer.OSM());

                        var markers = new OpenLayers.Layer.Markers("Markers");
                        map.addLayer(markers);
                        var iconSize = new OpenLayers.Size(32, 32);
                        var markerIcon = new OpenLayers.Icon('https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-128.png', iconSize, new OpenLayers.Pixel(-(iconSize.w / 2), -iconSize.h));

                        var latLong = new OpenLayers.LonLat(this.geotag.lng(), this.geotag.lat()).transform(new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                        map.getProjectionObject() // to Spherical Mercator Projection
                        );
                        markers.addMarker(new OpenLayers.Marker(latLong, markerIcon));
                        map.setCenter(latLong, 12);
                    }
                }]);
                return GeotagModal;
            }(Modal);

            _export('default', GeotagModal);
        }
    };
});;
'use strict';

System.register('reflar/geotags/extendEditorControls', ['flarum/extend', 'flarum/app', 'flarum/helpers/icon', 'flarum/components/TextEditor', 'reflar/geotags/components/GeotagListModal', 'reflar/geotags/components/GeotagCreateModal'], function (_export, _context) {
    "use strict";

    var extend, app, icon, TextEditor, GeotagListModal, GeotagCreateModal;

    _export('default', function () {
        TextEditor.prototype.geotags = [];
        TextEditor.prototype.originalGeotags = [];

        extend(TextEditor.prototype, 'init', function () {
            this.geotags = [];
            this.originalGeotags = [];
        });

        extend(TextEditor.prototype, 'controlItems', function (items) {
            if (!app.forum.attribute('canAddGeotags')) return;

            var textAreaObj = this;
            var geotagsNum = textAreaObj.geotags && textAreaObj.geotags.length ? textAreaObj.geotags.length : 0;

            items.add('reflar-geotags', m('div', {
                className: 'Button hasIcon reflar-geotags-button Button--icon',
                onclick: function onclick(e) {
                    e.preventDefault();
                    if (geotagsNum > 0) {
                        app.modal.show(new GeotagListModal({ textAreaObj: textAreaObj }));
                    } else {
                        app.modal.show(new GeotagCreateModal({ textAreaObj: textAreaObj, 'new': false }));
                    }
                }
            }, [icon('map-marker', { className: 'Button-icon' }), geotagsNum > 0 ? m('span', { className: 'Button-label-num' }, geotagsNum) : '', m('span', { className: 'Button-label' }, app.translator.trans('reflar-geotags.forum.post.geotag_editor_tooltip'))]), -1);

            $('.Button-label', '.item-reflar-geotags > div').hide();
            $('.item-reflar-geotags > div').hover(function () {
                $('.Button-label', this).show();$('.Button-label-num', this).hide();$(this).removeClass('Button--icon');
            }, function () {
                $('.Button-label', this).hide();$('.Button-label-num', this).show();$(this).addClass('Button--icon');
            });
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponentsTextEditor) {
            TextEditor = _flarumComponentsTextEditor.default;
        }, function (_reflarGeotagsComponentsGeotagListModal) {
            GeotagListModal = _reflarGeotagsComponentsGeotagListModal.default;
        }, function (_reflarGeotagsComponentsGeotagCreateModal) {
            GeotagCreateModal = _reflarGeotagsComponentsGeotagCreateModal.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('reflar/geotags/extendPostData', ['flarum/extend', 'flarum/components/ComposerBody', 'flarum/components/EditPostComposer', 'flarum/components/ReplyComposer', 'flarum/components/DiscussionComposer'], function (_export, _context) {
    "use strict";

    var extend, override, ComposerBody, EditPostComposer, ReplyComposer, DiscussionComposer;

    _export('default', function () {
        ComposerBody.prototype.submitGeotags = function (originalSubmit) {
            var geotags = this.editor.geotags;
            var originalGeotags = this.editor.originalGeotags;

            var deferreds = [];
            this.loading = true;
            $.each(originalGeotags, function (index, geotag) {
                if (!geotags.includes(geotag)) {
                    deferreds.push(geotag.delete());
                }
            });
            $.each(geotags, function (index, geotag) {
                if (!geotag.id() && !originalGeotags.includes(geotag)) {
                    deferreds.push(geotag.save(geotag.data.attributes));
                }
            });
            m.sync(deferreds).then(function () {
                originalSubmit();
            });
        };

        extend(EditPostComposer.prototype, 'init', function () {
            this.editor.geotags = this.props.post.geotags();
            this.editor.originalGeotags = this.props.post.geotags();
        });

        extend(EditPostComposer.prototype, 'data', function (data) {
            data.relationships = data.relationships || {};
            data.relationships.geotags = this.editor.geotags;
        });

        extend(ReplyComposer.prototype, 'data', function (data) {
            data.relationships = data.relationships || {};
            data.relationships.geotags = this.editor.geotags;
        });

        extend(DiscussionComposer.prototype, 'data', function (data) {
            data.relationships = data.relationships || {};
            data.relationships.geotags = this.editor.geotags;
        });

        override(EditPostComposer.prototype, 'onsubmit', function (original) {
            this.submitGeotags(original);
        });

        override(ReplyComposer.prototype, 'onsubmit', function (original) {
            this.submitGeotags(original);
        });

        override(DiscussionComposer.prototype, 'onsubmit', function (original) {
            this.submitGeotags(original);
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
            override = _flarumExtend.override;
        }, function (_flarumComponentsComposerBody) {
            ComposerBody = _flarumComponentsComposerBody.default;
        }, function (_flarumComponentsEditPostComposer) {
            EditPostComposer = _flarumComponentsEditPostComposer.default;
        }, function (_flarumComponentsReplyComposer) {
            ReplyComposer = _flarumComponentsReplyComposer.default;
        }, function (_flarumComponentsDiscussionComposer) {
            DiscussionComposer = _flarumComponentsDiscussionComposer.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('reflar/geotags/main', ['flarum/extend', 'flarum/app', 'flarum/models/Post', 'flarum/Model', 'reflar/geotags/models/Geotag', 'reflar/geotags/addGeotagsList', 'reflar/geotags/extendPostData', 'reflar/geotags/extendEditorControls'], function (_export, _context) {
    "use strict";

    var extend, override, app, Post, Model, Geotag, addGeotagsList, extendPostData, extendEditorControls;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
            override = _flarumExtend.override;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumModelsPost) {
            Post = _flarumModelsPost.default;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_reflarGeotagsModelsGeotag) {
            Geotag = _reflarGeotagsModelsGeotag.default;
        }, function (_reflarGeotagsAddGeotagsList) {
            addGeotagsList = _reflarGeotagsAddGeotagsList.default;
        }, function (_reflarGeotagsExtendPostData) {
            extendPostData = _reflarGeotagsExtendPostData.default;
        }, function (_reflarGeotagsExtendEditorControls) {
            extendEditorControls = _reflarGeotagsExtendEditorControls.default;
        }],
        execute: function () {

            app.initializers.add('reflar-geotags', function (app) {
                Post.prototype.geotags = Model.hasMany('geotags');
                app.store.models.geotags = Geotag;

                addGeotagsList();
                extendEditorControls();
                extendPostData();
            });
        }
    };
});;
'use strict';

System.register('reflar/geotags/models/Geotag', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, Geotag;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Geotag = function (_mixin) {
                babelHelpers.inherits(Geotag, _mixin);

                function Geotag() {
                    babelHelpers.classCallCheck(this, Geotag);
                    return babelHelpers.possibleConstructorReturn(this, (Geotag.__proto__ || Object.getPrototypeOf(Geotag)).apply(this, arguments));
                }

                return Geotag;
            }(mixin(Model, {
                title: Model.attribute('title'),
                lat: Model.attribute('lat'),
                lng: Model.attribute('lng')
            }));

            _export('default', Geotag);
        }
    };
});