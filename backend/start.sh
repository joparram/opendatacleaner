COMMIT=$(git rev-parse HEAD)
VERSION=$(cat VERSION)
FLASK_DEBUG=1
PYTHONUNBUFFERED="true"
docker build . --tag odc-backend:${VERSION}.${COMMIT}
docker stop odc-backend
docker rm odc-backend
docker run --rm -d -p 5000:5000 --env PYTHONUNBUFFERED=$PYTHONUNBUFFERED --env FLASK_DEBUG=$FLASK_DEBUG --name odc-backend odc-backend:${VERSION}.${COMMIT}
docker logs -f odc-backend
