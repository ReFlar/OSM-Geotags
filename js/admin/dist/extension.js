'use strict';

System.register('reflar/geotags/main', ['flarum/extend', 'flarum/app', 'flarum/components/PermissionGrid'], function (_export, _context) {
    "use strict";

    var extend, app, PermissionGrid;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }],
        execute: function () {

            app.initializers.add('reflar-geotags', function (app) {
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