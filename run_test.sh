#!/usr/bin/bash

cd /home/william/workspace/node/cs-linker
docker-compose -f testing/docker-compose.yml up -d
sleep 10
npm run mocha
docker-compose -f testing/docker-compose.yml down -v