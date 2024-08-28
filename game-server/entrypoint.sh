#!/bin/sh

/usr/sbin/crond -b

cd /bits-server/ && exec npm run start > /opt/logs/bits-server-out.log
