$.fn.locationPicker=function(e){var n,t,a=this,o=$.extend({address_el:'input[data-type="address"]',map_el:'[data-type="map"]',save_el:'[data-type="location-store"]',raw_data:!1,init:{current_location:!0}},e),r={},i=$(o.address_el),l=$(o.map_el),s=$(o.save_el),d=null,c=(n=new OpenLayers.Size(32,32),t=new OpenLayers.Pixel(-n.w/2,-n.h),new OpenLayers.Icon("https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-128.png",n,t)),g=function(){s.length>0&&s.val(JSON.stringify(r))},p=function(e){var n={address:e.formatted_address,location:{lat:e.geometry.location.lat(),long:e.geometry.location.lng()}};return o.raw_data&&(r.raw=e),n},u=function(e,n,t){void 0===t&&(t=!0),m({location:new google.maps.LatLng(e,n)});var a=new OpenLayers.LonLat(n,e).transform(new OpenLayers.Projection("EPSG:4326"),L.getProjectionObject());d=d?L.getZoom():12,t&&L.setCenter(a,d),O=new OpenLayers.Marker(a,c),y.clearMarkers(),y.addMarker(O)};OpenLayers.Control.Click=OpenLayers.Class(OpenLayers.Control,{defaultHandlerOptions:{single:!0,double:!1,pixelTolerance:0,stopSingle:!1,stopDouble:!1},initialize:function(e){this.handlerOptions=OpenLayers.Util.extend({},this.defaultHandlerOptions),OpenLayers.Control.prototype.initialize.apply(this,arguments),this.handler=new OpenLayers.Handler.Click(this,{click:this.trigger},this.handlerOptions)},trigger:function(e){var n=L.getLonLatFromPixel(e.xy).transform(L.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));r={location:{lat:n.lat,long:n.lon}},geoCoder.geocode({location:new google.maps.LatLng(n.lat,n.lon)},function(e,n){"OK"==n&&(r=p(e[0])),u(r.location.lat,r.location.long,!1),w()})}}),l.attr("id")||l.attr("id",String.fromCharCode(65+Math.floor(26*Math.random()))+Date.now());var L=new OpenLayers.Map(l.attr("id"));L.addLayer(new OpenLayers.Layer.OSM.HOT('HOT'));var y=new OpenLayers.Layer.Markers("Markers");L.addLayer(y);var f=new OpenLayers.Control.Click;L.addControl(f),f.activate();var O=null;geoCoder=new google.maps.Geocoder;var h=new google.maps.places.Autocomplete(i[0],{types:["geocode"]});google.maps.event.addListener(h,"place_changed",function(){place=h.getPlace(),r=p(place),u(r.location.lat,r.location.long),w()}),this.getData=function(){return r},this.getAddress=function(){return r.formatted_address};var m=function(e){geoCoder.geocode(e,function(e,n){"OK"==n&&(e.length>0?(r=p(e[0]),u(r.location.lat,r.location.long),w()):(r={},y.clearMarkers(),g(),w()))})};this.setAddress=function(e){m({address:e})},this.setLocation=function(e,n){m({location:new google.maps.LatLng(e,n)})};var w=function(){r.address&&i.val(r.address),g(),o.locationChanged&&o.locationChanged(r)};return o.init&&(o.init.current_location?navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(e){u(e.coords.latitude,e.coords.longitude)},function(e){u(49.8419505,24.0315968)}):o.init.address?a.setAddress(o.init.address):o.init.location&&a.setLocation(o.init.location.latitude,o.init.location.longitude)),this};;
'use strict';

System.register('reflar/geotags/addGeotagsList', ['flarum/extend', 'flarum/app', 'flarum/components/Button', 'flarum/components/CommentPost', 'flarum/components/IndexPage', 'flarum/helpers/icon', 'flarum/helpers/punctuateSeries', 'reflar/geotags/models/Geotag', 'reflar/geotags/components/GeotagModal'], function (_export, _context) {
    "use strict";

    var extend, app, Button, CommentPost, IndexPage, icon, punctuateSeries, Geotag, GeotagModal;

    _export('default', function () {

        extend(IndexPage.prototype, 'viewItems', function (items) {
            var geotags = [];
            var allGeotags = app.store.all('geotags');
            var tag = m.route();
            if (tag.includes('/t/')) {
                allGeotags.map(function (geotag, i) {
                    if (geotag.tagSlug() === tag.replace('/t/', '')) {
                        geotags.push(geotag);
                    }
                });
            } else {
                geotags = allGeotags;
            }
            items.add('geotags', Button.component({
                title: app.translator.trans('core.forum.index.mark_all_as_read_tooltip'),
                icon: 'map-marker',
                className: 'Button Button--icon',
                onclick: function onclick() {
                    app.modal.show(new GeotagModal({ geotags: geotags }));
                }
            }));
        });

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
                                app.modal.show(new GeotagModal({ geotags: [geotag] }));
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
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }, function (_flarumComponentsIndexPage) {
            IndexPage = _flarumComponentsIndexPage.default;
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
                        var _m, _m2;

                        return m(
                            'div',
                            { className: 'Modal-body' },
                            m(
                                'div',
                                { className: 'map-form-container' },
                                m(
                                    'form',
                                    { onsubmit: this.onsubmit.bind(this) },
                                    m(
                                        'div',
                                        { className: 'Map-field' },
                                        m(
                                            'div',
                                            { className: 'Form-group' },
                                            m(
                                                'label',
                                                null,
                                                app.translator.trans('reflar-geotags.forum.create_modal.address_label')
                                            )
                                        ),
                                        m('input', { 'data-type': 'address', className: 'FormControl Map-address-search' }),
                                        m('input', { type: 'hidden', 'data-type': 'location-store' }),
                                        m(
                                            'div',
                                            { className: 'Map-container', style: 'margin: 10px 0;' },
                                            m('div', { 'data-type': 'map', id: 'map', style: 'height: 400px; width: 100%;' })
                                        )
                                    ),
                                    FieldSet.component({
                                        className: 'Map-coordinates',
                                        label: app.translator.trans('reflar-geotags.forum.create_modal.coordinates_label') + ':',
                                        children: [m(
                                            'div',
                                            { className: 'Form-group' },
                                            m(
                                                'label',
                                                null,
                                                app.translator.trans('reflar-geotags.forum.create_modal.latitude_label')
                                            ),
                                            m('input', (_m = { type: 'number', className: 'FormControl Map-coordinates-lat' }, babelHelpers.defineProperty(_m, 'type', 'number'), babelHelpers.defineProperty(_m, 'value', this.geotagData.lat()), babelHelpers.defineProperty(_m, 'step', 'any'), babelHelpers.defineProperty(_m, 'onchange', m.withAttr('value', this.updateLocation.bind(this, 'lat'))), _m))
                                        ), m(
                                            'div',
                                            { className: 'Form-group' },
                                            m(
                                                'label',
                                                null,
                                                app.translator.trans('reflar-geotags.forum.create_modal.longitude_label')
                                            ),
                                            m('input', (_m2 = { type: 'number', className: 'FormControl Map-coordinates-lng' }, babelHelpers.defineProperty(_m2, 'type', 'number'), babelHelpers.defineProperty(_m2, 'value', this.geotagData.lng()), babelHelpers.defineProperty(_m2, 'step', 'any'), babelHelpers.defineProperty(_m2, 'onchange', m.withAttr('value', this.updateLocation.bind(this, 'lng'))), _m2))
                                        )]
                                    }),
                                    FieldSet.component({
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
                                    })
                                )
                            )
                        );
                    }
                }, {
                    key: 'updateLocation',
                    value: function updateLocation(type, value) {
                        if (type === 'lng') {
                            this.geotagData.lng(value);
                            this.mapField.setLocation(this.geotagData.lat(), value);
                        } else {
                            this.geotagData.lat(value);
                            this.mapField.setLocation(value, this.geotagData.lng());
                        }

                        m.redraw();
                    }
                }, {
                    key: 'getLocation',
                    value: function getLocation() {
                        var _this2 = this;

                        if ('geolocation' in navigator) {
                            m.startComputation();
                            navigator.geolocation.getCurrentPosition(function (position) {
                                _this2.geotagData.lat(position.coords.latitude);
                                _this2.geotagData.lng(position.coords.longitude);
                                _this2.mapField.setLocation(position.coords.latitude, position.coords.longitude);
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
                        var _this3 = this;

                        this.mapField = $(element).find('.Map-field');

                        $('#modal').on('shown.bs.modal', function () {
                            if ($('#map.olMap').length === 0) {
                                _this3.mapField.locationPicker({
                                    init: {
                                        location: {
                                            latitude: _this3.geotagData.lat(),
                                            longitude: _this3.geotagData.lng()
                                        }
                                    },
                                    locationChanged: function locationChanged(_ref) {
                                        var location = _ref.location;

                                        _this3.geotagData.lat(location.lat !== undefined ? location.lat : _this3.geotagData.lat());
                                        _this3.geotagData.lng(location.long !== undefined ? location.long : _this3.geotagData.lng());
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
                        this.geotag = this.props.textAreaObj.geotags[0];
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
                        return [m('div', { className: 'Modal-body' }, [FieldSet.component({
                            className: 'Geotags-list',
                            label: app.translator.trans('reflar-geotags.forum.list_modal.geotags_list_title') + ':',
                            children: [m('li', { className: 'Geotags-item' }, [m('a', {
                                href: '#',
                                onclick: function onclick(e) {
                                    e.preventDefault();
                                    parent.hide();
                                    app.modal.show(new GeotagModal({ geotags: [parent.geotag] }));
                                }
                            }, this.geotag.lat() + '°, ' + this.geotag.lng() + '°'), Button.component({
                                className: 'Button Button--icon Button--link',
                                icon: 'times',
                                title: app.translator.trans('reflar-geotags.forum.post.geotag_delete_tooltip'),
                                onclick: function onclick() {
                                    parent.hide();
                                    parent.props.textAreaObj.geotags = null;
                                }
                            })])]
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
                        this.geotags = this.props.geotags;
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'GeotagModal Modal--large';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('reflar-geotags.forum.view_modal.title');
                    }
                }, {
                    key: 'onready',
                    value: function onready() {
                        var _this2 = this;

                        if (this.geotags.length > 1) {
                            $('#modal').on('shown.bs.modal', function () {
                                _this2.loadMap();
                            });
                        } else {
                            this.loadMap();
                        }
                    }
                }, {
                    key: 'onhide',
                    value: function onhide() {
                        $('.Map-field').remove();
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        return [m('div', { className: 'Modal-body' }, [m('div', {
                            className: 'Map-field',
                            id: 'map',
                            style: { 'width': '100%', 'height': '400px' }
                        })])];
                    }
                }, {
                    key: 'loadMap',
                    value: function loadMap() {
                        var mapField = $('.Map-field');

                        if (mapField.hasClass('olMap') || this.geotags === null) return;

                        var map = new OpenLayers.Map(mapField.attr('id'));
                        map.addLayer(new OpenLayers.Layer.OSM.HOT('HOT'));

                        var markers = new OpenLayers.Layer.Markers("Markers");
                        map.addLayer(markers);
                        var iconSize = new OpenLayers.Size(32, 32);

                        this.geotags.map(function (geotag) {
                            var color = 'D94B43';
                            var icon = 'fa-circle';
                            if (app.session.user.id() == geotag.userId()) {
                                icon = 'fa-star';
                            }
                            if (geotag.markerColor()) {
                                color = geotag.markerColor().replace('#', '');
                            }
                            var markerUrl = 'https://cdn.mapmarker.io/api/v1/pin?icon=' + icon + '&background=' + color + '&size=50';

                            var latLong = new OpenLayers.LonLat(geotag.lng(), geotag.lat()).transform(new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                            map.getProjectionObject() // to Spherical Mercator Projection
                            );
                            markers.addMarker(new OpenLayers.Marker(latLong, new OpenLayers.Icon(markerUrl, iconSize, new OpenLayers.Pixel(-(iconSize.w / 2), -iconSize.h))));
                        });
                        map.zoomToExtent(markers.getDataExtent());
                        this.geotags = null;
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
                        app.modal.show(new GeotagCreateModal({ textAreaObj: textAreaObj }));
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

System.register('reflar/geotags/main', ['flarum/app', 'flarum/models/Post', 'flarum/Model', 'reflar/geotags/models/Geotag', 'reflar/geotags/addGeotagsList', 'reflar/geotags/extendPostData', 'reflar/geotags/extendEditorControls'], function (_export, _context) {
    "use strict";

    var app, Post, Model, Geotag, addGeotagsList, extendPostData, extendEditorControls;
    return {
        setters: [function (_flarumApp) {
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

                OpenLayers.Layer.OSM.HOT = OpenLayers.Class(OpenLayers.Layer.OSM, {
                    initialize: function initialize(name, options) {
                        var url = ["http://a.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png", "http://b.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png"];
                        options = OpenLayers.Util.extend({
                            numZoomLevels: 19,
                            attribution: "&copy; <a href='https://www.hotosm.org/'>Humanitarian OpenStreetMap</a>",
                            buffer: 0,
                            transitionEffect: "resize"
                        }, options);
                        var newArguments = [name, url, options];
                        OpenLayers.Layer.OSM.prototype.initialize.apply(this, newArguments);
                    },

                    CLASS_NAME: "OpenLayers.Layer.OSM.HOT"
                });
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
                userId: Model.attribute('user_id'),
                postId: Model.attribute('post_id'),
                lat: Model.attribute('lat'),
                lng: Model.attribute('lng'),
                tagSlug: Model.attribute('tag_slug'),
                markerColor: Model.attribute('marker_color')
            }));

            _export('default', Geotag);
        }
    };
});