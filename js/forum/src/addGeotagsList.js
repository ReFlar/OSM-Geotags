import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import CommentPost from 'flarum/components/CommentPost';
import IndexPage from 'flarum/components/IndexPage';
import icon from 'flarum/helpers/icon';
import punctuateSeries from 'flarum/helpers/punctuateSeries';

import Geotag from 'reflar/geotags/models/Geotag';
import GeotagModal from 'reflar/geotags/components/GeotagModal';

export default function() {

    extend(IndexPage.prototype, 'viewItems', function(items) {
       items.add('geotags',
           Button.component({
               title: app.translator.trans('core.forum.index.mark_all_as_read_tooltip'),
               icon: 'map-marker',
               className: 'Button Button--icon',
               onclick: () => {
                   app.modal.show(new GeotagModal({geotags: app.store.all('geotags')}))
               }
           })
           );
    });

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
                                app.modal.show(new GeotagModal({geotags: [geotag]}));
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
