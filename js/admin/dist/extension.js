'use strict';

System.register('reflar/geotags/components/GeotagsSettingsModal', ['flarum/app', 'flarum/components/SettingsModal'], function (_export, _context) {
    "use strict";

    var app, SettingsModal, GeotagsSettingsModal;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsSettingsModal) {
            SettingsModal = _flarumComponentsSettingsModal.default;
        }],
        execute: function () {
            GeotagsSettingsModal = function (_SettingsModal) {
                babelHelpers.inherits(GeotagsSettingsModal, _SettingsModal);

                function GeotagsSettingsModal() {
                    babelHelpers.classCallCheck(this, GeotagsSettingsModal);
                    return babelHelpers.possibleConstructorReturn(this, (GeotagsSettingsModal.__proto__ || Object.getPrototypeOf(GeotagsSettingsModal)).apply(this, arguments));
                }

                babelHelpers.createClass(GeotagsSettingsModal, [{
                    key: 'className',
                    value: function className() {
                        return 'Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('reflar-geotags.admin.modal.modal_title');
                    }
                }, {
                    key: 'form',
                    value: function form() {
                        return [m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('reflar-geotags.admin.modal.lat')), m('input', {
                            className: 'FormControl',
                            bidi: this.setting('reflar.geotags-default-lat')
                        }), m('label', {}, app.translator.trans('reflar-geotags.admin.modal.long')), m('input', {
                            className: 'FormControl',
                            bidi: this.setting('reflar.geotags-default-long')
                        })])];
                    }
                }]);
                return GeotagsSettingsModal;
            }(SettingsModal);

            _export('default', GeotagsSettingsModal);
        }
    };
});;
'use strict';

System.register('reflar/geotags/main', ['flarum/extend', 'flarum/app', 'flarum/components/PermissionGrid', 'reflar/geotags/components/GeotagsSettingsModal'], function (_export, _context) {
    "use strict";

    var extend, app, PermissionGrid, GeotagsSettingsModal;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }, function (_reflarGeotagsComponentsGeotagsSettingsModal) {
            GeotagsSettingsModal = _reflarGeotagsComponentsGeotagsSettingsModal.default;
        }],
        execute: function () {

            app.initializers.add('reflar-geotags', function (app) {
                app.extensionSettings['reflar-geotags'] = function () {
                    return app.modal.show(new GeotagsSettingsModal());
                };

                extend(PermissionGrid.prototype, 'startItems', function (items) {
                    items.add('addGeotags', {
                        icon: 'map-marker',
                        label: app.translator.trans('reflar-geotags.admin.permissions.add_geotags_label'),
                        permission: 'reflar.geotags.create'
                    });
                });
            });
        }
    };
});