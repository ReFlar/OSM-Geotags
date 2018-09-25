<?php

namespace Reflar\Geotags\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\PostBasicSerializer;
use Flarum\Core\Access\Gate;
use Flarum\Core\Post;
use InvalidArgumentException;
use Reflar\Geotags\Geotag;

class GeotagBasicSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'geotags';

    /**
     * @var Gate
     */
    protected $gate;

    /**
     * @param Gate $gate
     */
    public function __construct(Gate $gate)
    {
        $this->gate = $gate;
    }

    /**
     * {@inheritdoc}
     *
     * @param Geotag $geotag
     * @throws InvalidArgumentException
     */
    protected function getDefaultAttributes($geotag)
    {
        if (!($geotag instanceof Geotag)) {
            throw new InvalidArgumentException(get_class($this)
                . ' can only serialize instances of ' . Geotag::class);
        }

        $post = Post::find($geotag->post_id);

        $attributes = [
            'user_id' => $geotag->user_id,
            'lat' => (float)$geotag->lat,
            'lng' => (float)$geotag->lng
        ];

        if ($post) {
            $attributes['post_id'] = $post->id;
            $attributes['discussion_id'] = $post->discussion->id;
            $tag = $post->discussion->tags[0];
            if ($tag) {
                $attributes['marker_color'] = $tag->color;
                $attributes['tag_slug'] = $tag->slug;
            }
        }

        return $attributes;
    }
}
