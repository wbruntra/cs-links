#!/usr/bin/bash
DB_HOST=127.0.0.1
DB_PORT=3408
DB_PASSWORD=devdb
cd /home/william/workspace/node/cs-linker
docker-compose -f testing/docker-compose.yml up -d
while ! mysqladmin ping -h $DB_HOST -P $DB_PORT -u root -p$DB_PASSWORD --silent > /dev/null 2>&1; do
  echo 'MySQL not available, sleeping...'
  sleep 3
done
npm run mocha
docker-compose -f testing/docker-compose.yml down -v

