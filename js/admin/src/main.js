import { extend } from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('reflar-geotags', app => {
    extend(PermissionGrid.prototype, 'startItems', items => {
        items.add('addGeotags', {
            icon: 'map-marker',
            label: app.translator.trans('reflar-geotags.admin.permissions.add_geotags_label'),
            permission: 'reflar.geotags.create'
        });
    });
});
