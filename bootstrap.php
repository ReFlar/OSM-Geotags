<?php
namespace Reflar\Geotags;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddGeotagsApi::class);
    $events->subscribe(Listener\AddPostGeotagsRelationship::class);
};