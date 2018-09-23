import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Geotag extends mixin(Model, {
    title: Model.attribute('title'),
    lat: Model.attribute('lat'),
    lng: Model.attribute('lng')
}) {}