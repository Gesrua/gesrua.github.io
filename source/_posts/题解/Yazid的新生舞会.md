---
title: 「CodePlus 2017 11 月赛」Yazid 的新生舞会
tags:
  - 线段树
  - 数据结构
  - 差分
  - 众数
categories:
  - OI
  - 题解
date: 2019-10-01 23:43:57
---

给定长度为 $n\le10^5$ 的序列 $a$ ，统计满足以下条件的子区间数量

区间 $[l, r]$ 中，存在一个数 $x$ ，它的出现次数为 $m$，并且 $2m>r-l+1$

<!-- more -->

---

记录一下思考过程

首先觉得是枚举 $x$，那么记 $s_i = \sum_{k=1}^i [a_i=x]$ 

条件转化为 $2(s_r - s_l) > r - l$ （现在考虑 $[l+1, r]$ ）

化简一下 $2s_l-l<2s_r-r$

那么又记 $c_i = 2s_i - i$

也就是说，若 $c_l<c_r$ 则 $[l+1, r]$ 满足条件

对于每个 $c_r$ 都要数出来多少 $c_l$ 满足，朴素可能是 $O(nV)$

观察 $c_i$ 的性质，发现其为 $1+\sum_{i=1}^n [a_i=x]$ 个 $d=-1$ 的等差数列组合

:::success
还有另外一个思考方式

建立新数组

$$
b_i = \left\{
\begin{aligned}
&1~~~a_i=x\\
-&1~~~a_i\neq x
\end{aligned}
\right.
$$

建立 $b$ 的前缀和 $d$，$d$ 和 $c$ 完全相同
:::

然后就变成一道数据结构问题

:::info
维护序列 $a$，支持

1. 给出 $x,y$ ，区间加 $1$
2. 给出 $x,y$ ，回答 $\sum_{i=x}^y\sum_{j=1}^{x-1}a_i$
:::

对应到这个问题，就是定义 $p_x=\sum[c_i=x]$（当然这个 $p$ 是在更新的）

当正在处理 $a_e=x$ 时（此处的 $a$ 是原题的）

1. 处理对 $ans$ 的贡献
2. 更新 $p$

假设 $f$ 为 $e$ 之后第一个满足 $a_f=x$

那么对于 $c_e,c_{e+1},\cdots,c_{f-1}$ 为一个 $d=-1$的等差数列

记 $g=c_e,h=c_{f-1}$ 注意 $h<g$

$$
\begin{aligned}
\sum_{i=h}^g\sum_{j=-\infin}^{i-1}p_j
&=(g-h+1)\sum_{i=-\infin}^{h-1}p_i+\sum_{i=h}^{g-1}(g-i)p_i\\
&=(g-h+1)\sum_{i=-\infin}^{h-1}p_i+g\sum_{i=h}^{g-1}p_i-\sum_{i=h}^{g-1}i\cdot p_i
\end{aligned}
$$

即需要维护 $p_i$ 和 $i\cdot p_i$ ，可以通过开两个线段树解决，需支持区间求和、修改

常数极其巨大，最长一个点跑了 2.33s（未 -O2）

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

const int N = 500000;
const int FIX = N + 1;

struct S {
    struct Seg1 {
        struct Node {
            Node *ls, *rs;
            ll sum, tag;
            int clear;
            int l, r;
            int dis() { return r - l + 1; }
            void pushdown() {
                if (clear) ls->clear = rs->clear = 1, ls->tag = rs->tag = ls->sum = rs->sum = 0, clear = 0;
                ls->sum += ls->dis() * tag, ls->tag += tag;
                rs->sum += rs->dis() * tag, rs->tag += tag;
                tag = 0;
            }
            void maintain() { sum = ls->sum + rs->sum; }
        } T[8 * N];
        int cnt = 0, L, R;
        Node* root;
        Seg1() { build(root, 1, N + FIX); }
        void build(Node*& c, int l, int r) {
            c = &T[cnt++];
            c->l = l, c->r = r;
            if (l == r) return;
            int mid = (l + r) / 2;
            build(c->ls, l, mid), build(c->rs, mid + 1, r);
        }
        void clear() { root->sum = root->tag = 0, root->clear = 1; }
        void _e(Node* c) {
            if (L <= c->l && c->r <= R) {
                c->tag += 1, c->sum += c->dis();
                return;
            }
            if (c->r < L || R < c->l) return;
            c->pushdown();
            _e(c->ls), _e(c->rs);
            c->maintain();
        }
        ll _q(Node* c) {
            if (L <= c->l && c->r <= R) return c->sum;
            if (c->r < L || R < c->l) return 0;
            c->pushdown();
            return _q(c->ls) + _q(c->rs);
        }
        void edit(int l, int r) {
            L = l + FIX, R = r + FIX;
            _e(root);
        }
        ll query(int l, int r) {
            L = l + FIX, R = r + FIX;
            return _q(root);
        }
        void print(Node* c) {
            if (!c) return;
            cout << c->l << ' ' << c->r << endl;
            print(c->ls), print(c->rs);
        }
    } s1;
    struct Seg2 {
        int cnt = 0, L, R;
        struct Node {
            Node *ls, *rs;
            ll sum, tag;
            int clear;
            int l, r;
            ll calc() { return ((ll)l + r - 2 * FIX) * (r - l + 1) / 2; }
            int dis() { return r - l + 1; }
            void pushdown() {
                if (clear) ls->clear = rs->clear = 1, ls->tag = rs->tag = ls->sum = rs->sum = 0, clear = 0;
                ls->sum += ls->calc() * tag, ls->tag += tag;
                rs->sum += rs->calc() * tag, rs->tag += tag;
                tag = 0;
            }
            void maintain() { sum = ls->sum + rs->sum; }
        } T[8 * N];

        Node* root;
        Seg2() { build(root, 1, N + FIX); }
        void build(Node*& c, int l, int r) {
            c = &T[cnt++];
            c->l = l, c->r = r;
            if (l == r) return;
            int mid = (l + r) / 2;
            build(c->ls, l, mid), build(c->rs, mid + 1, r);
        }
        void clear() { root->sum = root->tag = 0, root->clear = 1; }
        void _e(Node* c) {
            if (L <= c->l && c->r <= R) {
                c->tag += 1, c->sum += c->calc();
                return;
            }
            if (c->r < L || R < c->l) return;
            c->pushdown();
            _e(c->ls), _e(c->rs);
            c->maintain();
        }
        ll _q(Node* c) {
            if (L <= c->l && c->r <= R) return c->sum;
            if (c->r < L || R < c->l) return 0;
            c->pushdown();
            return _q(c->ls) + _q(c->rs);
        }
        void edit(int l, int r) {
            L = l + FIX, R = r + FIX;
            _e(root);
        }
        ll query(int l, int r) {
            L = l + FIX, R = r + FIX;
            return _q(root);
        }
    } s2;
    void clear() { s1.clear(), s2.clear(); }
    void edit(int l, int r) {
        if (l > r) std::swap(l, r);
        // cerr << "editing" << endl;
        // rep(i, l, r) cerr << s1.query(i, i) << ' ';
        // cerr << endl;
        s1.edit(l, r), s2.edit(l, r);
        // rep(i, l, r) cerr << s1.query(i, i) << ' ';
        // cerr << endl;
    }
    ll query(ll x, ll y) {
        if (x > y) std::swap(x, y);
        return (y - x + 1) * s1.query(-N, x - 1) + y * s1.query(x, y - 1) - s2.query(x, y - 1);
    }
} s;
int n, a[N + 10];
struct X {
    struct Node {
        int pos;
        Node* nxt;
    } pool[N + 10];
    Node* p[N + 10];
    Node* end[N + 10];
    int cnt = 0;
    void add(int x, int pos) {
        pool[cnt].pos = pos, pool[cnt].nxt = nullptr;
        // p[x] = &pool[cnt++];
        if (p[x] == nullptr)
            p[x] = &pool[cnt], end[x] = &pool[cnt];
        else
            end[x]->nxt = &pool[cnt], end[x] = &pool[cnt];
        cnt++;
    }
    bool empty(int x) { return p[x] == nullptr; }
    void del(int x) { p[x] = p[x]->nxt; }
    int ask(int x) { return p[x] != nullptr ? p[x]->pos : (n + 1); }
} q;
int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(false);
    cout.tie(0);
    int t;
    cin >> n >> t;
    rep(i, 1, n) {
        cin >> a[i];
        q.add(a[i], i);
    }
    ll ans = 0;
    rep(x, 0, n) {
        // cerr << "doing " << x << endl;
        if (q.empty(x)) continue;
        s.clear();
        int pre = 0, lst = 0, cur, nxt;
        while (!q.empty(x)) {
            cur = q.ask(x);
            // cerr << "cur " << cur << endl;
            q.del(x);
            s.edit(2 * pre - lst, 2 * pre - (cur - 1));
            // cerr << "value " << 2 * pre - lst << ' ' << 2 * pre - (cur - 1) << endl;
            // cerr << "edit " << lst << ' ' << cur - 1 << endl;
            pre++, lst = cur;
            nxt = q.ask(x);
            // cerr << "ans " << s.query(2 * pre - cur, 2 * pre - (nxt - 1)) << endl;
            // cerr << "dbg " << s.s1.query(0, 2 * pre - (nxt - 1)) << endl;
            ans += s.query(2 * pre - cur, 2 * pre - (nxt - 1));
        }
    }
    cout << ans;
    return 0;
}
```