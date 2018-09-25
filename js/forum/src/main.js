import app from 'flarum/app';

import Post from 'flarum/models/Post';
import Model from 'flarum/Model';

import Geotag from 'reflar/geotags/models/Geotag';

import addGeotagsList from 'reflar/geotags/addGeotagsList';
import extendPostData from 'reflar/geotags/extendPostData';
import extendEditorControls from 'reflar/geotags/extendEditorControls';

app.initializers.add('reflar-geotags', app => {
    Post.prototype.geotags = Model.hasMany('geotags');
    app.store.models.geotags = Geotag;

    addGeotagsList();
    extendEditorControls();
    extendPostData();

    OpenLayers.Layer.OSM.HOT = OpenLayers.Class(OpenLayers.Layer.OSM, {
        initialize: function(name, options) {
            var url = [
                "https://a.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png",
                "https://b.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png"
            ];
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
