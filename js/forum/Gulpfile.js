var gulp = require('flarum-gulp');

gulp({
    files: [
        'node_modules/osm-locationpicker/dist/location-picker.min.js'
    ],
    modules: {
        'reflar/geotags': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});
