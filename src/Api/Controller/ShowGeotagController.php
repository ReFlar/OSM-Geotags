<?php
namespace Reflar\Geotags\Api\Controller;

use Reflar\Geotags\Api\Serializer\GeotagSerializer;
use Reflar\Geotags\Repository\GeotagRepository;
use Flarum\Api\Controller\AbstractResourceController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ShowGeotagController extends AbstractResourceController
{
    /**
     * @inheritdoc
     */
    public $serializer = GeotagSerializer::class;

    /**
     * {@inheritdoc}
     */
    public $include = [
        'user',
        'post'
    ];

    /**
     * @var GeotagRepository
     */
    protected $geotags;

    public function __construct(GeotagRepository $geotags)
    {
        $this->geotags = $geotags;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->geotags->findOrFail(array_get($request->getQueryParams(), 'id'), $request->getAttribute('actor'));
    }
}
