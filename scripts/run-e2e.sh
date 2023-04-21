#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
 
docker-compose up -d

echo '🟡 - Waiting for databases to be ready...'
$DIR/wait-for-it.sh "${MONGO_URL} ${PG_URL}" -- echo '🟢 - Databases are ready!'

echo '🟡 - Will try to seed databases...'
pnpm db:seed
echo '🟢 - Seeding completed!'

echo '🟡 - Running e2e tests...'
pnpm e2e:test