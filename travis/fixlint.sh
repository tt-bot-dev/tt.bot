#!/bin/bash
echo "Pinging with the header..."
curl http://tttie-linux.eastus.cloudapp.azure.com:9999 -H "Authorization: Basic $GIT_ACCESS_TOKEN"
echo "Checking out the current branch...."
git checkout $CURRENT_BRANCH
git config --global user.name "tt.bot" >/dev/null 2>&1
# this is on purpose, it's public, feel free to email me! - TTtie 2019
git config --global user.email \
    "whatdidyouthinkiwontleakmyprivate@email.cz" \
>/dev/null 2>&1 

echo "Linting, fixing the issues"
npm test -- --fix

echo "Adding the linted files"
git add .

echo "Committing"
git commit -m "Fix linting issues for $CURRENT_COMMIT"

echo "Pushing"
#git push https://tt-bot:$GIT_ACCESS_TOKEN@github.com/tt-bot-dev/tt.bot $CURRENT_BRANCH >/dev/null 2>&1
git -c http.extraheader="AUTHORIZATION: basic $GIT_ACCESS_TOKEN" push origin $CURRENT_BRANCH
exit 0
