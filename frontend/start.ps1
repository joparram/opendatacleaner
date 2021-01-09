$COMMIT=$(git rev-parse HEAD)
$VERSION=$(cat VERSION)
iex "docker build . --tag odc-frontend:${VERSION}.${COMMIT}"
try {
    iex "docker stop odc-frontend"
    iex "docker rm odc-frontend"
} catch {}
iex "docker run --rm -d -p 4200:4200 --name odc-frontend odc-frontend:${VERSION}.${COMMIT}"
docker logs -f odc-frontend
