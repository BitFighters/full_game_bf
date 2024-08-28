#!/bin/bash

export NODE_ENV=production
cp src/public/index.html dist/index.html
cp src/public/favicon.ico dist/favicon.ico
mkdir dist/assets
cp -R src/assets/ dist/asssets/