$COMMIT=$(git rev-parse HEAD)
$VERSION=$(cat VERSION)
$FLASK_DEBUG=1
$PYTHONUNBUFFERED=true
iex "docker build . --tag odc-backend:${VERSION}.${COMMIT}"
try {
    iex "docker stop odc-backend"
    iex "docker rm odc-backend"
} catch {}
iex "docker run --rm -d -p 5000:5000 --env PYTHONUNBUFFERED=$PYTHONUNBUFFERED --env FLASK_DEBUG=$FLASK_DEBUG --name odc-backend odc-backend:${VERSION}.${COMMIT}"
docker logs -f odc-backend