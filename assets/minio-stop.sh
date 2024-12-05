#!/bin/bash

docker stop -t 10 minio
docker rm -f minio
