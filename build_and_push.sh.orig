#/bin/bash

image_name=${PWD##*/}
echo "$image_name"
docker build -t "$image_name" .
docker tag "$image_name" "registry.digitalocean.com/dispersions/$image_name"
docker push "registry.digitalocean.com/dispersions/$image_name"
kubectl rollout restart deployment/$image_name
