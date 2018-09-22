import { extend } from 'flarum/extend';
import app from 'flarum/app';
import icon from 'flarum/helpers/icon';
import TextEditor from 'flarum/components/TextEditor';

import GeotagListModal from 'reflar/geotags/components/GeotagListModal';
import GeotagCreateModal from 'reflar/geotags/components/GeotagCreateModal';

export default function() {
    TextEditor.prototype.geotags = [];
    TextEditor.prototype.originalGeotags = [];

    extend(TextEditor.prototype, 'init', function()
    {
        this.geotags = [];
        this.originalGeotags = [];
    });

    extend(TextEditor.prototype, 'controlItems', function(items)
    {
        if (!app.forum.attribute('canAddGeotags')) return;

        let textAreaObj = this;
        let geotagsNum = textAreaObj.geotags && textAreaObj.geotags.length ? textAreaObj.geotags.length : 0;

        items.add('reflar-geotags',
            m('div', {
                className: 'Button hasIcon reflar-geotags-button Button--icon',
                onclick: function (e) {
                    e.preventDefault();
                    if (geotagsNum > 0) {
                        app.modal.show(new GeotagListModal({textAreaObj}));
                    } else {
                        app.modal.show(new GeotagCreateModal({textAreaObj}));
                    }
                }
            }, [
                icon('map-marker', {className: 'Button-icon'}),
                geotagsNum > 0 ? m('span', {className: 'Button-label-num'}, geotagsNum) : '',
                m('span', {className: 'Button-label'}, app.translator.trans('reflar-geotags.forum.post.geotag_editor_tooltip'))
            ])
            , -1);

        $('.Button-label', '.item-reflar-geotags > div').hide();
        $('.item-reflar-geotags > div').hover(
            function(){ $('.Button-label', this).show(); $('.Button-label-num', this).hide(); $(this).removeClass('Button--icon')},
            function(){ $('.Button-label', this).hide(); $('.Button-label-num', this).show(); $(this).addClass('Button--icon')}
        );
    });
}
