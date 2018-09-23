import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import FieldSet from 'flarum/components/FieldSet';

import GeotagModal from 'reflar/geotags/components/GeotagModal';

export default class GeotagListModal extends Modal {
    init() {
        this.textAreaObj = this.props.textAreaObj;
        console.log(this.textAreaObj.geotags)
    }

    className() {
        return 'GeotagListModal Modal--small';
    }

    title() {
        return app.translator.trans('reflar-geotags.forum.list_modal.geotags_title');
    }

    content() {
        var parent = this;
        var geotags = parent.textAreaObj.geotags;

        return [
            m('div', {className: 'Modal-body'}, [
                FieldSet.component({
                    className: 'Geotags-list',
                    label: app.translator.trans('reflar-geotags.forum.list_modal.geotags_list_title') + ':',
                    children: [
                        geotags.map(function (geotag, i) {
                            return [
                                m('li', {className: 'Geotags-item'}, [
                                    m('a', {
                                        href: '#',
                                        onclick: function (e) {
                                            e.preventDefault();
                                            parent.hide();
                                            app.modal.show(new GeotagModal({geotag}));
                                        }
                                    }, geotag.lat() + '°, ' + geotag.lng() + '°'),
                                    Button.component({
                                        className: 'Button Button--icon Button--link',
                                        icon: 'times',
                                        title: app.translator.trans('reflar-geotags.forum.post.geotag_delete_tooltip'),
                                        onclick: function () {
                                            geotags.splice(i, 1);
                                        }
                                    })
                                ]),
                            ];
                        })
                    ]
                }),
            ])
        ]
    }
}