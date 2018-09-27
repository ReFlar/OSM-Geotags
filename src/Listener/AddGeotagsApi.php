<?php
namespace Reflar\Geotags\Listener;

use Reflar\Geotags\Api\Controller;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\ConfigureApiRoutes;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Events\Dispatcher;

class AddGeotagsApi
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->get('/geotags', 'reflar.geotags.index', Controller\ListGeotagsController::class);
        $event->get('/geotags/{id}', 'reflar.geotags.get', Controller\ShowGeotagController::class);
        $event->post('/geotags', 'reflar.geotags.create', Controller\CreateGeotagController::class);
        $event->delete('/geotags/{id}', 'reflar.geotags.delete', Controller\DeleteGeotagController::class);
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        $settings = app()->make(SettingsRepositoryInterface::class);
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['canAddGeotags'] = $event->actor->can('reflar.geotags.create');
            $event->attributes['defaultLat'] = $settings->get('reflar.geotags-default-lat');
            $event->attributes['defaultLong'] = $settings->get('reflar.geotags-default-long');
        }
    }
}
