#!/bin/bash
COMMIT=$(git rev-parse HEAD)
VERSION=$(cat VERSION)
NODE_ENV="production"
docker build . --tag odc-frontend:${VERSION}.${COMMIT}
docker stop odc-frontend 2>/dev/null
docker rm odc-frontend 2>/dev/null
docker run --rm -d -p 3000:80 --env NODE_ENV=$NODE_ENV --name odc-frontend odc-frontend:${VERSION}.${COMMIT}
docker logs -f odc-frontend
