#!/bin/bash
set -e

function pushToOwO() {
    git remote add owo https://$GITLAB_USERNAME:$GITLAB_ACCESS_TOKEN@owo.codes/TTtie/tt.bot.git
    git push owo $TRAVIS_BRANCH >/dev/null 2>&1
    echo "Successfully pushed to OwO"
}

if [[ "$TRAVIS_COMMIT_MESSAGE" == noci-* ]]; then
    echo "\e[31mTest triggered for a no CI commit, pushing to OwO and ignoring."
    pushToOwO
    exit 0
fi

pushToOwO
npm test