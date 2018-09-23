<?php
namespace Reflar\Geotags\Command;

use Reflar\Geotags\Events\GeotagWillBeSaved;
use Reflar\Geotags\Geotag;
use Carbon\Carbon;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Foundation\Application;
use Illuminate\Events\Dispatcher;

class CreateGeotagHandler
{
    use DispatchEventsTrait;
    use AssertPermissionTrait;

    protected $users;
    
    protected $app;

    /**
     * @param Dispatcher        $events
     * @param UserRepository    $users
     * @param Application       $app
     */
    public function __construct(Dispatcher $events, UserRepository $users, Application $app)
    {
        $this->events    = $events;
        $this->users     = $users;
        $this->app       = $app;
    }

    public function handle(CreateGeotag $command)
    {
        $this->assertCan(
            $command->actor,
            'reflar.geotags.create'
        );

        $data = $command->data;

        $geotag = (new Geotag())->forceFill([
            'user_id'       => $command->actor->id,
            'post_id'       => $command->postId ? $command->postId : 0,
            'lat'           => array_get($data, 'attributes.lat'),
            'lng'           => array_get($data, 'attributes.lng'),
            'created_at'    => Carbon::now()
        ]);

        $this->events->fire(
            new GeotagWillBeSaved($command->actor, $geotag, $command->data)
        );

        $geotag->save();

        return $geotag;
    }
}
