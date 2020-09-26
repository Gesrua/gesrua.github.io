---
title: 用 GitHub Actions 自动部署 Hexo
tags:
  - 乱七八糟
categories:
  - Geek
date: 2019-08-24 12:27:58
disableNunjucks: true
---

忽然发现 GitHub Actions beta 的资格下来了，就想着折腾一下

顺便改了一下 Repo 的结构和部署脚本

<!-- more -->

```plain
原来
chaigidel.github.io:hexo --> Traivs CI --> chaigidel.github.io:master

现在
blog_source:master --> GitHub Actions --> chaigidel.github.io:master
```

`GH_PAT` 是 GitHub Presonal Access Token 勾上 Repo 权限就行

`Page_repo` 是 `Chaigidel/chaigidel.github.io`

{% codeblock lang:bash publish-to-gh-pages.sh %}
#!/bin/bash
set -ev
remote_repo="https://${GH_PAT}@github.com/${Page_repo}.git"
remote_branch="master"

cd public
git init
git config user.name "GitHub Actions"
git config user.email "github-actions-bot@users.noreply.github.com"
git add .

git commit -m "Auto Builder at `date +"%Y-%m-%d %H:%M"` from ${GITHUB_REPOSITORY}"
git push --force "${remote_repo}" master:${remote_branch}

echo "Deploy complete"
{% endcodeblock %}

关于 `secrets` 的[文档](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables)，在项目 `settings->Secrets` 里设置

{% codeblock lang:yaml .github/workflows/main.yml %}
{% raw %}name: CI
on:
  push:
   branches:
   - master
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - uses: actions/setup-node@master
      with:
        node-version: 10.x 
    - name: Install Dependencies
      run: |
        git submodule init
        git submodule update
        npm install -g hexo
        npm install
    - name: Clean
      run: hexo clean
    - name: Generate
      run: hexo generate
    - name: Checkdir
      run: ls ./public
    - name: Deploy
      env:
        GH_PAT: ${{ secrets.GH_PAT }}
        Page_repo: "Chaigidel/chaigidel.github.io"
      run: sh publish-to-gh-pages.sh{% endraw %}
{% endcodeblock %}
