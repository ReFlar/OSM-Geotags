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
});
