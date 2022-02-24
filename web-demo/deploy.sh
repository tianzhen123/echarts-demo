#!/usr/bin/env sh
###
 # @Description: 
 # @Autor: tianzhen
 # @Date: 2021-08-13 17:13:44
 # @LastEditors: Set Name
 # @LastEditTime: 2021-08-13 17:16:21
### 

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/tianzhen123/componentEchart.git master:gh-pages
# 例如 git push -f git@github.com:koala-coding/blog.git master:gh-pages 
cd -
