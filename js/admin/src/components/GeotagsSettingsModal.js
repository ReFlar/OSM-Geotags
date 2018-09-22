import app from 'flarum/app';
import SettingsModal from 'flarum/components/SettingsModal';

export default class GeotagsSettingsModal extends SettingsModal {
    className() {
        return 'Modal--small';
    }

    title() {
        return app.translator.trans('reflar-geotags.admin.settings.modal_title');
    }

    form() {
        return [
            m('div', {className: 'Form-group'}, [
                m('label', {}, app.translator.trans('reflar-geotags.admin.settings.api_label')),
                m('input', {
                    className: 'FormControl',
                    bidi: this.setting('reflar.geotags-gmaps-key')
                })
            ])
        ];
    }
}