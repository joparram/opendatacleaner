$COMMIT=$(git rev-parse HEAD)
$VERSION=$(cat VERSION)
$NODE_ENV="production"
iex "docker build . --tag odc-frontend:${VERSION}.${COMMIT}"
try {
    iex "docker stop odc-frontend"
    iex "docker rm odc-frontend"
} catch {}
iex "docker run --rm -d -p 3000:80 --env NODE_ENV=$NODE_ENV --name odc-frontend odc-frontend:${VERSION}.${COMMIT}"
docker logs -f odc-frontend
