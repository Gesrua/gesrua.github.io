---
title: 「POJ 2311」Cutting Game
tags:
  - 博弈论
  - 思维
  - POJ
categories:
  - OI
  - 题解
date: 2019-10-04 14:43:52
---

$w\times h$ 的纸张，每次能沿横或纵切一刀，最先切出 $1\times1$ 的人赢

$2\le w,h\le 200$

<!-- more -->

---

需要注意的是这时候判胜负不是“能不能进行下一次操作”，而是“最先切出 $1\times 1$ ”，需要稍作转换

发现所有 $1\times n$ 都是必胜的

即转移到 $1\times n$ 是不行的


```cpp
int sg[210][210];
int calc(int x, int y) {
    if (x > y) std::swap(x, y);
    if (sg[x][y] != -1) return sg[x][y];
    std::set<int> s;
    rep(i, 2, x - 2) // 不能切出 1*n
        s.insert(calc(i, y) ^ calc(x - i, y));
    rep(i, 2, y - 2) // 不能切出 n*1
        s.insert(calc(x, i) ^ calc(x, y - i));
    int lst = 0;
    while (s.count(lst)) lst++;
    return sg[x][y] = lst;
}
```

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
typedef unsigned long long ull;

int sg[210][210];

int calc(int x, int y) {
    if (x > y) std::swap(x, y);
    if (sg[x][y] != -1) return sg[x][y];
    std::set<int> s;
    rep(i, 2, x - 2) s.insert(calc(i, y) ^ calc(x - i, y));
    rep(i, 2, y - 2) s.insert(calc(x, i) ^ calc(x, y - i));
    int lst = 0;
    while (s.count(lst)) lst++;
    return sg[x][y] = lst;
}

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(false);
    cout.tie(0);
    std::memset(sg, -1, sizeof(sg));
    sg[1][1] = 0;
    int x, y;
    while (cin >> x >> y) {
        cout << (calc(x, y) ? "WIN" : "LOSE") << endl;
    }
    return 0;
}
```