#!/bin/bash
echo "Checking out the current branch ($CURRENT_BRANCH)...."
git config --global user.name "tt.bot" >/dev/null 2>&1

echo "Linting, fixing the issues"
npm test -- --fix

echo "Adding the linted files"
git add .

echo "Committing"
git commit -m "Fix linting issues for $CURRENT_COMMIT"

echo "Pushing"
git push https://$COMMIT_AUTHOR:$GIT_ACCESS_TOKEN@github.com/$CURRENT_REPO "HEAD:$CURRENT_BRANCH" >/dev/null #2>&1
exit 0
