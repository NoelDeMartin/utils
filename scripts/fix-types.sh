#!/usr/bin/env bash

# Remove any references to runtime error class in order to avoid type errors in different environments
sed -i "s/class JSError extends RuntimeErrorClass/class JSError/" dist/noeldemartin-utils.d.ts
sed -i "/const RuntimeErrorClass/d" dist/noeldemartin-utils.d.ts
