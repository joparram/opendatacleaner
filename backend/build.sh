#/bin/bash
COMMIT=$(git rev-parse HEAD)
VERSION=$(cat VERSION)
docker build . --tag odc-backend:$VERSION.$COMMIT
