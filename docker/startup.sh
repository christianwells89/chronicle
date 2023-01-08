#!/bin/sh

# set token secret to a random uuid if not already set
export TOKEN_SECRET="${TOKEN_SECRET:-$(cat /proc/sys/kernel/random/uuid)}"

set -ex

npx -y prisma@4.8.1 migrate deploy
node server.js