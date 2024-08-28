#!/bin/bash

# Find all TypeScript files (excluding node_modules) and add comments at the top if not already added
find . -type f -name "*.ts" -not -path "./node_modules/*" -exec awk '
    NR==1 {
        if (!(/\/\/ @ts-nocheck/ || /\/\* eslint @typescript-eslint\/no-unused-vars: off/ || /\/\* eslint @typescript-eslint\/no-explicit-any: off/)) {
            print "// @ts-nocheck\n/* eslint @typescript-eslint/no-unused-vars: off */\n/* eslint @typescript-eslint/no-explicit-any: off */"
        }
    }
    { print }
' {} > temp && mv temp {} \;
