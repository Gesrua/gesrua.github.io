---
title: 「SDOI 2009」HH的项链
tags:
  - SDOI
  - 省选
  - 树状数组
  - 线段树
  - 可持久化
categories:
  - OI
  - 题解
date: 2019-08-03 23:50:33
---

称贝壳的种类为颜色

考虑离线做法，将询问按照 $r$ 升序排序

发现只需要维护每个颜色的目前最右出现位置（ $\le r$ ）

每个颜色只在最后出现的地方进行统计，显然可以保证最优（因为离线）

举个例子

```
颜色序列为
1 3 1 2 1

扫到 1 （位置）
1 0 0 0 0
扫到 2
1 1 0 0 0
扫到 3
0 1 1 0 0
扫到 4
0 1 1 1 0
扫到 5
0 1 0 1 1
```

0/1 序列用树状数组维护即可，答案即是 0/1 序列 $sum(l, r)$

在线做法，用可持久化线段树即可

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

const int N = 500100;

struct Q {
    int id, l, r, ans;
} q[N];
int a[N], c[N], lst[1000100], n;

bool cmp_r(const Q& x, const Q& y) { return x.r < y.r; }
bool cmp_id(const Q& x, const Q& y) { return x.id < y.id; }
inline int lowbit(int i) { return i & (-i); }
void add(int i, int x) {
    for (; i <= n; i += lowbit(i)) c[i] += x;
}
int s(int i) {
    int ret = 0;
    for (; i > 0; i -= lowbit(i)) ret += c[i];
    return ret;
}
int ask(int l, int r) { return s(r) - s(l - 1); }

int main() {
#ifdef LOCAL
    freopen("/tmp/1878/1878/1.in", "r", stdin);
#endif
    std::ios::sync_with_stdio(false);
    cout.tie(0);
    cin >> n;
    rep(i, 1, n) cin >> a[i];
    int m;
    cin >> m;
    rep(i, 1, m) {
        q[i].id = i;
        cin >> q[i].l >> q[i].r;
    }
    std::sort(q + 1, q + 1 + m, cmp_r);
    int idx = 1;
    rep(i, 1, m) {
        for (; idx <= q[i].r; ++idx) {
            if (lst[a[idx]]) add(lst[a[idx]], -1);
            add(idx, 1);
            lst[a[idx]] = idx;
        }
        q[i].ans = ask(q[i].l, q[i].r);
    }
    std::sort(q + 1, q + 1 + m, cmp_id);
    rep(i, 1, m) cout << q[i].ans << endl;
    return 0;
}
```