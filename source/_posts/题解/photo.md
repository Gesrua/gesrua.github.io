---
title: 「USACO 2013」Photo
date: 2019-10-17 13:19:52
tags:
  - 题解
  - USACO
  - 动态规划
categories:
  - OI
---

给定长为 $n\le 2\times 10^5$ 的序列，你需要将其中 $k$ 个节点染色，满足 $m\le 10^5$ 组条件：$[l_i, r_i]$ 中有且仅有一个节点被染色。

最大化 $k$

[题面](https://www.luogu.org/problem/P3084)，[数据](http://www.usaco.org/current/data/photo_open13_gold.zip)

<!-- more -->

---

又是一道神 DP，虐爆我

定义 $f_i$ 为在最后在 $i$ 染色，并且保证 $1\sim i$ 合法的最多染色个数

考虑如何由 $f_j\, j<i$ 推得 $f_i$

如果要染 $i$ ，如果 **限制条件** $x$ 包含 $i$（ 即 $i\in[l_x, r_x]$ ） 由于需要满足 **仅有一个** ，所以 $j<\min_{i\le r_x} l_x$ （当然也要满足 $j<i$ ）

若从 $j$ 转移，则意味着 $j+1 \sim i-1$ 都不会选了，由于需要满足 **至少一个** ，则 $j\ge \max_{r_x<i} l_x$

预处理

```cpp
#define ckmin(x, y) x = std::min(x, y)
#define ckmax(x, y) x = std::max(x, y)
while (m--) {
    int l, r; cin >> l >> r;
    ckmin(minl[r], l);
    ckmax(maxl[r + 1], l);
}
per(i, n, 1) ckmin(minl[i], minl[i + 1]);
rep(i, 1, n + 1) ckmax(maxl[i], maxl[i - 1]);
// 注意边界
```

```cpp
#include <algorithm>
#include <bitset>
#include <cassert>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <deque>
#include <iostream>
#include <map>
#include <queue>
#include <random>
#include <set>
#include <stack>
#include <string>
#include <utility>
#include <vector>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr;
using std::endl;
using std::make_pair;
using std::pair;
typedef pair<int, int> pii;
typedef long long ll;
typedef unsigned int ui;
typedef unsigned long long ull;

// #define DEBUG 1  //调试开关
struct IO {
#define MAXSIZE (1 << 20)
#define isdigit(x) (x >= '0' && x <= '9')
    char buf[MAXSIZE], *p1, *p2;
    char pbuf[MAXSIZE], *pp;
#if DEBUG
#else
    IO() : p1(buf), p2(buf), pp(pbuf) {}
    ~IO() { fwrite(pbuf, 1, pp - pbuf, stdout); }
#endif
    inline char gc() {
#if DEBUG  //调试，可显示字符
        return getchar();
#endif
        if (p1 == p2) p2 = (p1 = buf) + fread(buf, 1, MAXSIZE, stdin);
        return p1 == p2 ? -1 : *p1++;
    }
    inline bool blank(char ch) { return ch == ' ' || ch == '\n' || ch == '\r' || ch == '\t'; }
    template <class T>
    inline void read(T &x) {
        register double tmp = 1;
        register bool sign = 0;
        x = 0;
        register char ch = gc();
        for (; !isdigit(ch); ch = gc())
            if (ch == '-') sign = 1;
        for (; isdigit(ch); ch = gc()) x = x * 10 + (ch - '0');
        if (ch == '.')
            for (ch = gc(); isdigit(ch); ch = gc()) tmp /= 10.0, x += tmp * (ch - '0');
        if (sign) x = -x;
    }
    inline void read(char *s) {
        register char ch = gc();
        for (; blank(ch); ch = gc())
            ;
        for (; !blank(ch); ch = gc()) *s++ = ch;
        *s = 0;
    }
    inline void read(char &c) {
        for (c = gc(); blank(c); c = gc())
            ;
    }
    inline void push(const char &c) {
#if DEBUG  //调试，可显示字符
        putchar(c);
#else
        if (pp - pbuf == MAXSIZE) fwrite(pbuf, 1, MAXSIZE, stdout), pp = pbuf;
        *pp++ = c;
#endif
    }
    template <class T>
    inline void write(T x) {
        if (x < 0) x = -x, push('-');  // 负数输出
        static T sta[35];
        T top = 0;
        do {
            sta[top++] = x % 10, x /= 10;
        } while (x);
        while (top) push(sta[--top] + '0');
    }
    inline void write(const char *s) {
        while (*s != '\0') push(*(s++));
    }
    template <class T>
    inline void write(T x, char lastChar) {
        write(x), push(lastChar);
    }
} io;

const int N = 200100;

int maxl[N], minl[N], f[N];

#define ckmin(x, y) x = std::min(x, y)
#define ckmax(x, y) x = std::max(x, y)

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    int n, m;
    io.read(n), io.read(m);
    rep(i, 0, n + 1) minl[i] = i;
    while (m--) {
        int l, r;
        io.read(l), io.read(r);
        ckmin(minl[r], l);
        ckmax(maxl[r + 1], l);
    }

    per(i, n, 1) ckmin(minl[i], minl[i + 1]);
    rep(i, 1, n + 1) ckmax(maxl[i], maxl[i - 1]);

    std::deque<int> q;
    int ptr = 1;
    q.push_back(0);

    rep(i, 1, n + 1) {
        for (; ptr < minl[i]; ptr++) {
            if (f[ptr] == -1) continue;
            while (q.size() && f[q.back()] <= f[ptr]) q.pop_back();
            q.push_back(ptr);
        }

        while (q.size() && q.front() < maxl[i]) q.pop_front();

        if (q.size())
            f[i] = f[q.front()] + (i == n + 1 ? 0 : 1);
        else
            f[i] = -1;
    }
    io.write(f[n + 1]);
    return 0;
}
```