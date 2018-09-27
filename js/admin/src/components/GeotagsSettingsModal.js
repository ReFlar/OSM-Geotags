import app from 'flarum/app';
import SettingsModal from 'flarum/components/SettingsModal';

export default class GeotagsSettingsModal extends SettingsModal {
    className() {
        return 'Modal--small';
    }

    title() {
        return app.translator.trans('reflar-geotags.admin.modal.modal_title');
    }

    form() {
        return [
            m('div', {className: 'Form-group'}, [
                m('label', {}, app.translator.trans('reflar-geotags.admin.modal.lat')),
                m('input', {
                    className: 'FormControl',
                    bidi: this.setting('reflar.geotags-default-lat')
                }),
                m('label', {}, app.translator.trans('reflar-geotags.admin.modal.long')),
                m('input', {
                    className: 'FormControl',
                    bidi: this.setting('reflar.geotags-default-long')
                })
            ])
        ];
    }
}