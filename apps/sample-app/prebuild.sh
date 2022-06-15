#!/bin/bash

cd ../../packages

cd ./acme-core && npm run build
cd ../acme-utils && npm run build
cd ../create-turbo && npm run build
cd ../logger && npm run build
cd ../turbo-codemod && npm run build
cd ../turbo-ignore && npm run build
cd ../ui && npm run build


