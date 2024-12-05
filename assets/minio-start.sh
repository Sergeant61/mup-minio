#!/bin/bash

MINIO_VERSION=<%= minioVersion %>
MINIO_DIR=<%= minioDir %>
MINIO_HOST=<%= minioHost %>
MINIO_PORT=<%= minioPort %>
MINIO_CONSOLE_PORT=<%= minioConsolePort %>
MINIO_ROOT_USER=<%= minioRootUser %>
MINIO_ROOT_PASSWORD=<%= minioRootPassword %>

set -e
sudo docker pull quay.io/minio/minio:$MINIO_VERSION

set +e

docker stop -t=10 minio
sudo docker rm -f minio

set -e

echo "Starting minio:$MINIO_VERSION"

docker run \
  -d \
  -p $MINIO_PORT:9000 \
  -p $MINIO_CONSOLE_PORT:9001 \
  --name minio \
  -v $MINIO_DIR/data:/data \
  -e "MINIO_ROOT_USER=$MINIO_ROOT_USER" \
  -e "MINIO_ROOT_PASSWORD=$MINIO_ROOT_PASSWORD" \
  quay.io/minio/minio:$MINIO_VERSION server /data --console-address ":$MINIO_CONSOLE_PORT"

