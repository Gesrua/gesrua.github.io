---
title: "神奇的无旋 Treap ── FHQ-Treap"
tags:
  - 数据结构
  - 平衡树
  - 无旋 Treap
  - 学习笔记
categories:
  - OI
date: 2019-08-11 16:30:07
---

本文将介绍一种平衡树

复杂度我不会证

实现非常简单

<!-- more -->

每个节点的定义如下，和普通 Treap 相同，比二叉搜索树多了 `pri` 优先级

```cpp
struct Node {
    int key, cnt, siz, pri;
    Node *ls, *rs;
    void upd() { siz = (ls ? ls->siz : 0) + (rs ? rs->siz : 0) + cnt; }
    int rank() { return (ls ? ls->siz : 0) + 1; }
} T[N];
typedef std::pair<Node *, Node *> pnn;
```

## 基本操作

### 开点

`pri` 随机赋值

```cpp
Node *gen(int x) {
    static int cnt = 0;
    T[cnt].cnt = 1, T[cnt].key = x, T[cnt].ls = T[cnt].rs = nullptr,
    T[cnt].siz = 1, T[cnt].pri = rnd();
    return &T[cnt++];
}
```

### 分裂

#### 按权值分裂

将一棵根节点为 $u$ 的树，分裂为两棵，一棵权值都 $\le k$，另一棵都 $> k$

```cpp
pnn split(Node *u, int key) {
    if (u == nullptr) return {nullptr, nullptr};
    if (u->key > key) {
        pnn o = split(u->ls, key);
        u->ls = o.second;
        u->upd();
        return {o.first, u};
    } else {
        pnn o = split(u->rs, key);
        u->rs = o.first;
        u->upd();
        return {u, o.second};
    }
}
```

#### 按排名分裂

将一棵根节点为 $u$ 的树，分裂为两棵，一棵排名都 $\le k$，另一棵都 $> k$

删除第 $k$ 小的时候比较有用

```cpp
pnn split_rank(Node *u, int k) {
    if (u == nullptr) return {nullptr, nullptr};
    if (u->rank() <= k) {
        pnn o = split_rank(u->rs, k - (u->rank() + u->r - u->l));
        u->rs = o.first;
        u->upd();
        return {u, o.second};
    } else {
        pnn o = split_rank(u->ls, k);
        u->ls = o.second;
        u->upd();
        return {o.first, u};
    }
}
```

### 合并

树 $u$ 的权值**均小于等于** $v$

```cpp
Node *merge(Node *u, Node *v) {
    if (u == nullptr) return v;
    if (v == nullptr) return u;
    if (u->pri > v->pri) {
        u->rs = merge(u->rs, v);
        u->upd();
        return u;
    } else {
        v->ls = merge(u, v->ls);
        v->upd();
        return v;
    }
}
```

### 查询第 k 小

这个是普通搜索树的操作

当然如果用按排名分裂也是可以的

```cpp
int kth(Node *u, int k) {
    while (u->rank() != k) {
        if (u->rank() < k)
            k -= u->rank(), u = u->rs;
        else
            u = u->ls;
    }
    return u->key;
}
```

## 衍生操作

### 插入 x

```cpp
o = split(rt, x);
rt = merge(merge(o.first, gen(x)), o.second);
```

### 删除 x

```cpp
o = split(rt, x);
t = split(o.first, x - 1);
t.second = merge(t.second->ls, t.second->rs);
rt = merge(merge(t.first, t.second), o.second);
```

### x 的排名

注意 `o.first` 可能为空

```cpp
o = split(rt, x - 1);
io.write((o.first ? o.first->siz : 0) + 1);
merge(o.first, o.second);
```

### x 前驱

```cpp
o = split(rt, x - 1);
io.write(kth(o.first, o.first->siz));
merge(o.first, o.second);
```

### x 后继

```cpp
o = split(rt, x);
io.write(kth(o.second, 1));
merge(o.first, o.second);
```

## 完整代码

```cpp
#define NDEBUG
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
// #pragma GCC optimize("Ofast")
// #pragma GCC optimize("inline")
// #pragma GCC optimize("-fgcse")
// #pragma GCC optimize("-fgcse-lm")
// #pragma GCC optimize("-fipa-sra")
// #pragma GCC optimize("-ftree-pre")
// #pragma GCC optimize("-ftree-vrp")
// #pragma GCC optimize("-fpeephole2")
// #pragma GCC optimize("-ffast-math")
// #pragma GCC optimize("-fsched-spec")
// #pragma GCC optimize("unroll-loops")
// #pragma GCC optimize("-falign-jumps")
// #pragma GCC optimize("-falign-loops")
// #pragma GCC optimize("-falign-labels")
// #pragma GCC optimize("-fdevirtualize")
// #pragma GCC optimize("-fcaller-saves")
// #pragma GCC optimize("-fcrossjumping")
// #pragma GCC optimize("-fthread-jumps")
// #pragma GCC optimize("-funroll-loops")
// #pragma GCC optimize("-fwhole-program")
// #pragma GCC optimize("-freorder-blocks")
// #pragma GCC optimize("-fschedule-insns")
// #pragma GCC optimize("inline-functions")
// #pragma GCC optimize("-ftree-tail-merge")
// #pragma GCC optimize("-fschedule-insns2")
// #pragma GCC optimize("-fstrict-aliasing")
// #pragma GCC optimize("-fstrict-overflow")
// #pragma GCC optimize("-falign-functions")
// #pragma GCC optimize("-fcse-skip-blocks")
// #pragma GCC optimize("-fcse-follow-jumps")
// #pragma GCC optimize("-fsched-interblock")
// #pragma GCC optimize("-fpartial-inlining")
// #pragma GCC optimize("no-stack-protector")
// #pragma GCC optimize("-freorder-functions")
// #pragma GCC optimize("-findirect-inlining")
// #pragma GCC optimize("-fhoist-adjacent-loads")
// #pragma GCC optimize("-frerun-cse-after-loop")
// #pragma GCC optimize("inline-small-functions")
// #pragma GCC optimize("-finline-small-functions")
// #pragma GCC optimize("-ftree-switch-conversion")
// #pragma GCC optimize("-foptimize-sibling-calls")
// #pragma GCC optimize("-fexpensive-optimizations")
// #pragma GCC optimize("-funsafe-loop-optimizations")
// #pragma GCC optimize("inline-functions-called-once")
// #pragma GCC optimize("-fdelete-null-pointer-checks")
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr;
using std::endl;
using std::make_pair;
using std::pair;
typedef pair<int, int> pii;
typedef long long ll;
typedef unsigned int ui;

// #define DEBUG 1  //调试开关
struct IO {
#define MAXSIZE (1 << 20)
#define isdigit(x) (x >= '0' && x <= '9')
    char buf[MAXSIZE], *p1, *p2;
    char pbuf[MAXSIZE], *pp;
#if DEBUG
#else
    IO() : p1(buf), pp(pbuf) { p2 = buf + fread(buf, 1, MAXSIZE, stdin); }
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
    template <class T>
    inline void write(T x, char lastChar) {
        write(x), push(lastChar);
    }
} io;

inline int rnd() {
    static int seed = 703;
    return seed = int(seed * 48271LL % 2147483647);
}

const int N = 150000;
struct Node {
    int key, cnt, siz, pri;
    Node *ls, *rs;
    void upd() { siz = (ls ? ls->siz : 0) + (rs ? rs->siz : 0) + cnt; }
    int rank() { return (ls ? ls->siz : 0) + 1; }
} T[N];
typedef std::pair<Node *, Node *> pnn;
Node *gen(int x) {
    static int cnt = 0;
    T[cnt].cnt = 1, T[cnt].key = x, T[cnt].ls = T[cnt].rs = nullptr, T[cnt].siz = 1, T[cnt].pri = rnd();
    return &T[cnt++];
}

pnn split(Node *u, int key) {
    if (u == nullptr) return {nullptr, nullptr};
    if (u->key > key) {
        pnn o = split(u->ls, key);
        u->ls = o.second;
        u->upd();
        return {o.first, u};
    } else {
        pnn o = split(u->rs, key);
        u->rs = o.first;
        u->upd();
        return {u, o.second};
    }
}
Node *merge(Node *u, Node *v) {
    if (u == nullptr) return v;
    if (v == nullptr) return u;
    if (u->pri > v->pri) {
        u->rs = merge(u->rs, v);
        u->upd();
        return u;
    } else {
        v->ls = merge(u, v->ls);
        v->upd();
        return v;
    }
}

int kth(Node *u, int k) {
    assert(u != nullptr);
    while (u->rank() != k) {
        if (u->rank() < k)
            k -= u->rank(), u = u->rs;
        else
            u = u->ls;
        assert(u != nullptr);
    }
    assert(u != nullptr);
    return u->key;
}

void print(Node *u) {
    if (u == nullptr) return;
    print(u->ls);
    cerr << u->key << ' ';
    print(u->rs);
}

const int inf = 1e8;

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    int n;
    io.read(n);
    Node *rt = nullptr;
    // int itm = 0;
    while (n--) {
        int opt, x;
        io.read(opt), io.read(x);
        pnn o, t;
        // cerr << (++itm) << endl;
        switch (opt) {
            case 1:
                // insert
                o = split(rt, x);
                rt = merge(merge(o.first, gen(x)), o.second);
                break;
            case 2:
                // del
                o = split(rt, x);
                t = split(o.first, x - 1);
                t.second = merge(t.second->ls, t.second->rs);
                rt = merge(merge(t.first, t.second), o.second);
                break;
            case 3:
                // x's rank
                o = split(rt, x - 1);
                io.write((o.first ? o.first->siz : 0) + 1, '\n');
                merge(o.first, o.second);
                break;
            case 4:
                // whose rank is x
                io.write(kth(rt, x), '\n');
                break;
            case 5:
                // pre
                o = split(rt, x - 1);
                io.write(kth(o.first, o.first->siz), '\n');
                merge(o.first, o.second);
                break;
            case 6:
                //  nxt
                o = split(rt, x);
                io.write(kth(o.second, 1), '\n');
                merge(o.first, o.second);
                break;
        }
        // print(rt);
        // cerr << endl;
    }
    return 0;
}
```