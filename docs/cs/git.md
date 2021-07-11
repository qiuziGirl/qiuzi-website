# Git

本文不会介绍 Git 的基本操作，而把关注点放在工作中可以常用却被忽视的**高级**操作。另外，推荐文章 [Git操作可视化介绍 10 大命令](https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1)。

## Rebase

该命令可以让和 `merge` 命令得到的结果基本是一致的。

通常使用 `merge` 操作将分支上的代码合并到 `master` 中，分支样子如下所示

![](http://qiuzi-blog.oss-cn-shenzhen.aliyuncs.com/qiuzi-website/Snipaste_2021-07-11_16-44-27.png)

使用 `rebase` 后，会将 `develop` 上的 `commit` 按顺序移到 `master` 的第三个 `commit` 后面，如下所示

![](http://qiuzi-blog.oss-cn-shenzhen.aliyuncs.com/qiuzi-website/Snipaste_2021-07-11_16-45-46.png)

`rebase` 对比 `merge`，优势在于合并后的结果很清晰，只有一条线；劣势在于一旦出现冲突，解决冲突会很麻烦，可能需要解决多个冲突，但是 `merge` 出现冲突只需要解决一次。

**总的原则**：只对尚未推送或分享给别人的本地修改执行 `rebase`操作清理历史， 从不对已推送至别处的提交执行 `rebase` 操作，详细参考 [git 官网](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA)。

使用 `rebase` 应该在需要被 `rebase` 的分支上操作，假设 `develop` 分支需要 `rebase` 到 `master` 分支，操作如下所示

```shell
# branch develop
git rebase master
git switch master
# 用于将 master 上的 HEAD 移动到最新的 commit
git merge develop
```

## Stash

`stash` 用于临时保存工作目录的改动。开发中可能会遇到代码写到一半需要切换分支进行其他操作。如果这时不想 `commit`，则可以使用该命令。

```shell
git stash
```

使用该命令可以暂存工作目录，若需要恢复工作目录，只需要使用

```shell
git stash pop
```

## Reflog

`reflog` 可以看到 HEAD 的移动记录。假如之前误删了一个分支，可以通过 `git reflog` 查看移动 HEAD 的哈希值

![](http://qiuzi-blog.oss-cn-shenzhen.aliyuncs.com/qiuzi-website/2019-06-01-43130.png)

从图中可以看出，HEAD 的最后一次移动行为是 `merge` 后，接下来分支 `new` 就被删除了。那么，我们可以通过以下命令找回 `new` 分支

```shell
git checkout 37d9aca
git switch -c new
```
PS：`reflog` 记录是有时效的，只会保存一段时间内的记录。

## Reset

如果你想删除刚写的 commit，则可以通过以下命令实现

```shell
git reset --hard HEAD^
```

但是 `reset` 的本质并不是删除 `commmit`，而是重新设置 HEAD 和它指向的 branch。