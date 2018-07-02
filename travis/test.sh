#!/bin/bash
set -e
TRAVIS_ALLOW_FAILURE=true # This is linting for god's sake
if [[ "$TRAVIS_COMMIT_MESSAGE" == noci-* ]]; then
    echo "\e[31mTest triggered for a no CI commit, pushing to OwO and ignoring."
    exit 0
fi

npm test