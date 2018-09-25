import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Geotag extends mixin(Model, {
    userId: Model.attribute('user_id'),
    postId: Model.attribute('post_id'),
    lat: Model.attribute('lat'),
    lng: Model.attribute('lng'),
    tagSlug: Model.attribute('tag_slug'),
    discussionId: Model.attribute('discussion_id'),
    markerColor: Model.attribute('marker_color')
}) {}