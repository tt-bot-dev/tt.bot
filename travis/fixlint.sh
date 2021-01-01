#!/bin/bash
# Copyright (C) 2021 tt.bot dev team
# 
# This file is part of tt.bot.
# 
# tt.bot is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# tt.bot is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License
# along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
echo "Checking out the current branch ($CURRENT_BRANCH)...."
git config --global user.name "tt.bot" >/dev/null 2>&1
git config --global user.email "whatdidyouthinkiwontleakmyprivate@email.cz" >/dev/null 2>&1

echo "Linting, fixing the issues"
npm test -- --fix

echo "Adding the linted files"
git add .

echo "Committing"
git commit -m "Fix linting issues for $CURRENT_COMMIT"

echo "Pushing"
git push https://$COMMIT_AUTHOR:$GIT_ACCESS_TOKEN@github.com/$CURRENT_REPO "HEAD:$CURRENT_BRANCH" >/dev/null 2>&1
exit 0
