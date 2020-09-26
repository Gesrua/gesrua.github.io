
#!/bin/bash
set -ev
remote_repo="https://${GH_PAT}@github.com/${Page_repo}.git"
remote_branch="gh-pages"

cd public
git init
git config user.name "GitHub Actions"
git config user.email "github-actions-bot@users.noreply.github.com"
git add .

git commit -m "Auto Builder at `date +"%Y-%m-%d %H:%M"` from ${GITHUB_REPOSITORY}"
git push --force "${remote_repo}" master:${remote_branch}

echo "Deploy complete"