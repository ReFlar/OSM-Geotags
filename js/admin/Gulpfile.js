var gulp = require('flarum-gulp');

gulp({
    modules: {
        'reflar/geotags': [
            'src/**/*.js'
        ]
    }
});