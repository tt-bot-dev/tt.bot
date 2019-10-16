#!/bin/bash
set -e
if [ "$(git log -1 $CURRENT_COMMIT --pretty="%aN")" == "tt-bot" ]; then
    echo "A commit is made by tt-bot, ignoring."
    exit 0
fi
npm test