---
title: Jury Compromise
tags:
  - 题解
  - 动态规划
  - 链表
categories:
  - OI
date: 2019-07-20 22:01:03
---

尽量充分利用状态，降低复杂度，[另外一道题](https://blog.chaigidel.ink/archives/%E9%A2%98%E8%A7%A3/%E6%9C%89%E7%BA%BF%E7%94%B5%E8%A7%86%E7%BD%91.html)

状态设计比较巧妙

$F$[ 剩余空间 ][ 辩方总分 - 控方总分 ] = 辩方总分 + 控方总分

跑一个背包

$F[v+1, x + a_i - b_i] = \max\{F[v, x] + a_i + b_i, F[v+1, x + a_i - b_i]\}$

找方案比较麻烦，如果直接记由哪个状态转移来是不行的，因为后续更新会破坏

所以要搞一个类似链表的东西

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

int f[202][9000], a[202], b[202], path[202][9000];

const int fix = 4500;

struct Node {
    int prev, i;
} p[10000000];
int cnt = 1;

void output(int id) {
    if (p[id].i == 0) return;
    output(p[id].prev);
    cout << ' ' << p[id].i;
}

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(false);
    cout.tie(0);
    int n, m;
    // clang-format off
    int T = 0;
    while (cin >> n >> m) {
        ++T;
        cnt = 1;
        if (n == 0 && m == 0) break;
        rep(i, 1, n) cin >> a[i] >> b[i];
        rep(i, 0, 201) rep(j, 0, 8999) f[i][j] = -1000000, path[i][j] = 0;
        f[0][0 + fix] = 0;
        rep(i, 1, n) per(v, m, 0) rep(x, -4000, 4000) {
            if (f[v][x + fix] + a[i] + b[i] > f[v + 1][x + a[i] - b[i] + fix]) {
                f[v + 1][x + a[i] - b[i] + fix] = f[v][x + fix] + a[i] + b[i],
                // path[v + 1][x + a[i] - b[i] + fix] = i;
                path[v + 1][x + a[i] - b[i] + fix] = cnt;
                p[cnt].i = i, p[cnt++].prev = path[v][x + fix];
            }
        }
        // clang-format on

        rep(i, 0, 4000) {
            if (f[m][i + fix] >= 0 || f[m][-i + fix] >= 0) {
                cout << "Jury #" << T << endl;
                if (f[m][i + fix] > f[m][-i + fix]) {
                    cout << "Best jury has value " << (f[m][i + fix] + i) / 2
                         << " for prosecution and value "
                         << (f[m][i + fix] - i) / 2 << " for defence:" << endl;
                    // cout << f[m][i + fix] << endl;
                    output(path[m][i + fix]);
                } else {
                    cout << "Best jury has value " << (f[m][fix - i] - i) / 2
                         << " for prosecution and value "
                         << (f[m][fix - i] + i) / 2 << " for defence:" << endl;


                    output(path[m][fix - i]);
                }
                cout << endl << endl;
                break;
            }
        }
    }
    return 0;
}
```
