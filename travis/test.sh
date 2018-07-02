#!/bin/bash
set -e

if [[ "$TRAVIS_COMMIT_MESSAGE" == noci-* ]]; then
    echo "\e[31mTest triggered for a no CI commit, pushing to OwO and ignoring."
    exit 0
fi

npm test