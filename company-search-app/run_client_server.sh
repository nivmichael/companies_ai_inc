#!/usr/bin/bash
cd client/
npm run serve &
sleep 1
cd ../server/
npm start

