COMMIT=$(git rev-parse HEAD)
VERSION=$(cat VERSION)
Start-Job { 
Start-Job { docker stop odc-backend }
$job = Start-Job { docker run --rm -d --network --name odc-backend odc-backend:$VERSION:$COMMIT }