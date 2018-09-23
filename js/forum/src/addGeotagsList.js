import { extend } from 'flarum/extend';
import app from 'flarum/app';
import CommentPost from 'flarum/components/CommentPost';
import icon from 'flarum/helpers/icon';
import punctuateSeries from 'flarum/helpers/punctuateSeries';

import Geotag from 'reflar/geotags/models/Geotag';
import GeotagModal from 'reflar/geotags/components/GeotagModal';

export default function() {
    extend(CommentPost.prototype, 'footerItems', function(items) {
        const post = this.props.post;
        const geotags = post.geotags();

        if (geotags && geotags.length) {
            const titles = geotags.map(geotag => {
                if (geotag instanceof Geotag) {
                    return [
                        m('a', {
                            href: '#',
                            onclick: function (e) {
                                e.preventDefault();
                                app.modal.show(new GeotagModal({geotag}));
                            }
                        }, geotag.lat() + '°, ' + geotag.lng() + '°')
                    ];
                }
            });

            items.add('geotags', [
                m('div', {className: 'Post-geotags'}, [
                    icon('map-marker'),
                    app.translator.trans('reflar-geotags.forum.post.geotags_title') + ': ',
                    punctuateSeries(titles)
                ])
            ])
        }
    });
}
