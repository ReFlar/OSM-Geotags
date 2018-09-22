var gulp = require('flarum-gulp');

gulp({
    files: [
        'node_modules/osm-locationpicker/src/location-picker.js'
    ],
    modules: {
        'reflar/geotags': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});
