---
title: 求 LCA 的 Tarjan 算法
tags:
  - LCA
  - 学习笔记
  - 算法
  - 图论
categories:
  - OI
date: 2019-07-14 20:27:12
---

这是一个复杂度为 $O(n+q)$ 的离线求 LCA 算法

用 dfs 进行遍历并打 tag

假设遍历到 $u$，则已回溯的节点标为 $2$，遍历到但未回溯的节点（即 $u$ 和 $u$ 的祖先）标 $1$，其余为 $0$

现在假设 $u$ 的子树处理完毕，考虑 $u$ 的处理

询问节点为 $(u, v)$

此时，若 $\mathrm{tag}_v = 2$，则可以保证 $v$ 向根走遇到的第一个 $\mathrm{tag} = 1$ 的节点即为 $\mathrm{LCA}(u,v)$，可以用反证法证明

:::info

若向根走遇到的第一个 $\mathrm{tag} = 1$ 的节点，记为 $w$，$w \not = \mathrm{LCA}(u,v)$

记 $\mathrm{LCA}(u,v)$ 为 $p$

显然 $p$ 在 $u$ 到根的路径上

若 $p$ 在 $w$ 下方，则 $\mathrm{tag}_p \not= 1$，但是 $p$ 又为 $u$ 的祖先，$\mathrm{tag}=1$

矛盾

若 $p$ 在 $w$ 上方，根据算法可得 $w$ 为 $v$ 的 祖先，又 $\mathrm{tag}_w = 1$ 得 $w$ 为 $u$ 的祖先，所以 $w$ 必为 $u$ 和 $v$ 的公共祖先，但是 $p$ 是 $w$ 的祖先

矛盾

证毕
:::

下面的程序复杂度应该没有问题，但是要卡一下常，吸一口氧才能过

<!-- more -->

```cpp
#include <algorithm>
#include <cassert>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <deque>
#include <iostream>
#include <map>
#include <queue>
#include <set>
#include <stack>
#include <string>
#include <utility>
#include <vector>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr;
using std::cin;
using std::cout;
using std::endl;
using std::make_pair;
using std::pair;
typedef pair<int, int> pii;
typedef long long ll;
typedef unsigned int ui;

const int N = 500010;

std::vector<int> g[N * 2], query[N], query_id[N];

int tag[N], ans[N], fa[N];

int get(int x) { return (x == fa[x]) ? x : (fa[x] = get(fa[x])); }

void tarjan(int u) {
    tag[u] = 1;
    for (auto v : g[u]) {
        if (tag[v] == 0) {
            tarjan(v);
            fa[v] = u;
        }
    }
    for (int i = 0; i < query[u].size(); ++i) {
        int v = query[u][i];
        if (tag[v] == 2) {
            ans[query_id[u][i]] = get(v);
        }
    }
    tag[u] = 2;
}

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(false);
    cout.tie(0);
    int n, m, s;
    cin >> n >> m >> s;
    fa[1] = 1;
    rep(i, 2, n) {
        fa[i] = i;
        int u, v;
        cin >> u >> v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    rep(i, 1, m) {
        int u, v;
        cin >> u >> v;
        query[u].push_back(v), query_id[u].push_back(i);
        query[v].push_back(u), query_id[v].push_back(i);
    }
    tarjan(s);
    rep(i, 1, m) cout << ans[i] << endl;
    return 0;
}
```