echo "Pushing to $TRAVIS_BRANCH..."
git remote add owo https://$GITLAB_USERNAME:$GITLAB_ACCESS_TOKEN@owo.codes/TTtie/tt.bot.git
git push owo HEAD:$TRAVIS_BRANCH >/dev/null 2>&1
echo "Successfully pushed to OwO"