---
title: 雅礼集训瞎做
tags:
  - 线段树
  - 势能分析
  - 找规律
categories:
  - OI
  - 题解
date: 2020-01-22 13:09:52
cover: thumbnails/76268289.jpg
toc: true
---

{% pixiv 76268289 anomalous Alcxome %}

## 2017

### 「雅礼集训 2017 Day1」市场

支持区间减，区间整除，区间最小查询，区间和查询。

线段树，考虑一个区间的最大值 $a$ 和最小值 $b$

若 $k=a-\lfloor a/d \rfloor = b-\lfloor b/d \rfloor$，
则对于 $a<c<b$ 有 $c-\lfloor c/d\rfloor=k$

事实上满足上述的只有 $a=b$ 或 $a=b+1$

证明可令 $a=\alpha k+p_1,b=\beta k+p_2$ 具体略

<!-- more -->

于是可转化为区间减处理。

做法和复杂度都很神秘。

```cpp
#include <bits/stdc++.h>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr; using std::cin; using std::cout; using std::endl;
typedef long long ll; typedef unsigned int ui; typedef unsigned long long ull;
using std::make_pair; using std::pair; typedef pair<int, int> pii; typedef pair<int, ll> pil;

const int N = 100010;

inline int fdiv(int x, int y){
    if (x >= 0) return x/y;
    else return (x-y+1)/y;
}

struct Node{
    int l, r, max, min, tag; ll sum;
    Node *lc, *rc;
    void add(int x){
        max += x, min += x, tag += x, sum += (r-l+1)*x;
    }
    void pushdown(){
        if (tag != 0){
            lc->add(tag); rc->add(tag); tag = 0;
        }
    }
    void maintain(){
        max = std::max(lc->max, rc->max);
        min = std::min(lc->min, rc->min);
        sum = lc->sum + rc->sum;
    }
    void add(int l, int r, int x){
        if (l <= this->l && this->r <= r){
            add(x); return;
        }
        pushdown();
        if (l <= lc->r) lc->add(l, r, x);
        if (rc->l <= r) rc->add(l, r, x);
        maintain();
    }
    void div(int l, int r, int x){
        if (l <= this->l && this->r <= r && max - fdiv(max, x) == min - fdiv(min, x)){
            add(fdiv(max, x) - max); return;
        }
        // if (max - fdiv(max, x) == min - fdiv(min, x)){
        //     add(l, r, fdiv(max, x) - max);
        //     return;
        // }
        pushdown();
        if (l <= lc->r) lc->div(l, r, x);
        if (rc->l <= r) rc->div(l, r, x);
        maintain();
    }
    ll qsum(int l, int r){
        if (l <= this->l && this->r <= r) return sum;

        ll ret = 0;
        pushdown();
        if (l <= lc->r) ret += lc->qsum(l, r);
        if (rc->l <= r) ret += rc->qsum(l, r);
        return ret;
    }
    int qmin(int l, int r){
        if (l <= this->l && this->r <= r) return min;

        int ret = 1e9;
        pushdown();
        if (l <= lc->r) ret = std::min(ret, lc->qmin(l, r));
        if (rc->l <= r) ret = std::min(ret, rc->qmin(l, r));
        return ret;
    }
    void show(){
        if (l == r){
            cerr << max << ' '; return;
        }
        pushdown();
        lc->show();
        rc->show();
    }
} T[N*4]; int c = 0;
Node* build(int l, int r){
    Node* ret = &T[c++];
    ret->l = l, ret->r = r;
    if (l != r){
        int mid = (l+r)/2;
        ret->lc = build(l, mid);
        ret->rc = build(mid+1, r);
        ret->maintain();
    } else {
        cin >> ret->min;
        ret->max = ret->sum = ret->min;
    }
    return ret;
}

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(0); cout.tie(0);
    int n, q; cin >> n >> q;
    Node* tree = build(0, n-1);
    while(q--){
        int opt;
        cin >> opt;
        if (opt == 1){
            int l, r, c; cin >> l >> r >> c;
            tree->add(l, r, c);
        } else if (opt == 2){
            int l, r, d; cin >> l >> r >> d;
            tree->div(l, r, d);
        } else if (opt == 3){
            int l, r; cin >> l >> r;
            cout << tree->qmin(l, r) << '\n';
        } else {
            int l, r; cin >> l >> r;
            cout << tree->qsum(l, r) << '\n';
        }
    }
    return 0;
}
```

### 「雅礼集训 2017 Day1」矩阵

操作就是把一行赋给一列，不难发现，若最后列要都变黑，那么作为模板的行必须全黑。

于是现在考虑如何将第 $i$ 行变全黑，记第 $i$ 行的白点数为 $c$

若第 $i$ 列存在一个黑点，那么代价为 $c$

若第 $i$ 行存在一个黑点，可先将这个点转到第 $i$ 列，那么代价为 $c+1$

如果一列全黑，则不用赋，用 $d$ 体现

```cpp
#include <bits/stdc++.h>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr; using std::cin; using std::cout; using std::endl;
typedef long long ll; typedef unsigned int ui; typedef unsigned long long ull;
using std::make_pair; using std::pair; typedef pair<int, int> pii; typedef pair<int, ll> pil;

const int N = 2010, inf = 1e8;

int hang[N], lie[N], cnt[N], cntlie[N];
char g[N][N];

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(0); cout.tie(0);
    int n; cin >> n;
    rep(i, 1, n) cin >> g[i] + 1;
    int ans = inf;
    rep(i, 1, n){
        rep(j, 1, n) if (g[i][j] == '.') cnt[i]++;
        hang[i] = (cnt[i] < n);
    }
    int d = n;
    rep(j, 1, n){
        rep(i, 1, n) if (g[i][j] == '.') cntlie[j]++;
        lie[j] = (cntlie[j] < n);
        d -= (cntlie[j] == 0);
    }
    rep(i, 1, n){
        int t = 0;
        bool flag = 0;
        if (lie[i]) flag = 1;
        else if (hang[i]) flag = 1, t = 1;
        if (flag){
            ans = std::min(ans, t + cnt[i] + d);
        }
    }
    if (ans == inf) ans = -1;
    cout << ans << endl;
    return 0;
}
```

### 「雅礼集训 2017 Day2」水箱

看到了好几个做法，可并堆不会就不介绍了

解法都须利用挡板带来的性质。

#### 并查集

这种做法比较玄妙，我对着代码瞪了一点时间才搞明白。

首先把条件和挡板都看作一个操作，按高度从小到大排序。

水高 $h$ 从小到达考虑

对于每个水箱，有 $f$ 和 $g$ 两个属性，$f$ 为该水箱 水高 $\le h$ 的最大答案，$g$ 是当前 $h$ 下水箱的最大答案。

当考虑挡板时，用并查集合并，$f$ 相加，$g$ 相加。

当考虑 $k=0$ 时，$f=f+1$

当考虑 $k=1$ 时，$g=g+1$，用 $g$ 更新 $f$

这个方法的正确性在于，在每个水箱影响到其他水箱之前，互相影响的水箱就合并了，统一考虑对答案的影响。

注意同一高度，优先级为 挡板、$k=0$ 、$k=1$ （数据水测不出来）

```cpp
#include <bits/stdc++.h>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr; using std::cin; using std::cout; using std::endl;
typedef long long ll; typedef unsigned int ui; typedef unsigned long long ull;
using std::make_pair; using std::pair; typedef pair<int, int> pii; typedef pair<int, ll> pil;

const int N = 100010;

namespace DisjointSetUnion {
template <int N>
struct DisjointSetUnion {
    int fa[N];
    DisjointSetUnion() {
        for (register int i = 0; i < N; ++i) fa[i] = i;
    }
    int getf(int x) { return fa[x] = (fa[x] == x ? x : getf(fa[x])); }
    inline void merge(int x, int y) { fa[getf(x)] = getf(y); }
    inline bool same(int x, int y) { return getf(x) == getf(y); }
};
};  // namespace DisjointSetUnion
DisjointSetUnion::DisjointSetUnion<N> dsu;

struct OPT{
    int i, y, k;
} q[N+N];
inline bool cmp(const OPT& a, const OPT& b){
    return a.y != b.y ? a.y < b.y : a.k < b.k;
}
int f[N], g[N];

void solve(){
    for (register int i = 0; i < N; ++i) dsu.fa[i] = i;
    std::memset(f, 0, sizeof(f)); std::memset(g, 0, sizeof(g));
    int n, m; cin >> n >> m;
    int cnt = 0;
    rep(i, 1, n - 1){ q[++cnt].i = i; cin >> q[cnt].y; q[cnt].k = -1; }
    rep(i, 1, m){ ++cnt; cin >> q[cnt].i >> q[cnt].y >> q[cnt].k; }
    std::sort(q+1, q+1+cnt, cmp);
    rep(qaq, 1, cnt){
        int i = q[qaq].i, y = q[qaq].y, k = q[qaq].k;
        if (k == -1){
            int j = dsu.getf(i + 1); i = dsu.getf(i);
            f[i] += f[j], g[i] += g[j]; dsu.fa[j] = i;
        } else if (k == 0){
            i = dsu.getf(i);
            f[i]++; // y + 0.5 无水
        } else {
            i = dsu.getf(i);
            g[i]++;
            f[i] = std::max(f[i], g[i]); // y + 0.5 有水
        }
    }
    cout << f[dsu.getf(1)] << endl;
}

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(0); cout.tie(0);
    int T; cin >> T;
    while(T--) solve();
}
```

#### 动态规划 + 线段树

$f_{i, j}$ 为第 $i$ 个水箱高度为 $j$ 是最大答案，转移是显然的，可用线段树优化。

#### 主席树 + 分治

定义 $g(l, r, x)$  为 $l\cdots r$ 水箱，水高 $x$ 时的答案

定义 $f(l,r)$ 为 $l\cdots r$ 水箱，水高不超过 $l$ 左侧挡板高 $h_1$ 且不超过 $r$ 右侧挡板高 $h_2$ 的最优答案。

考虑　$l\le k<r$ 且 $k$ 右边的挡板为 $l\cdots r$ 中最高的（除了两边）。

转移依旧显然，记 $k$ 右边的挡板高度为 $l$

$$
f(l,r) = \max\left\{
\begin{aligned}
&f(l,k) + f(k+r,r)\\
&\max_{l<x\le \min h_1,h_2} g(l, r, x)
\end{aligned}
\right.
$$

$g$ 用主席树快速计算（单点修改，区间询问，$x$ 的取值很少）

### 「雅礼集训 2017 Day2」线段游戏

据说是李超树模板，不过我不会

每个节点存储从上传下来的在 $mid$ 处最大的线段。

十分玄妙，请看代码

```cpp
#include <bits/stdc++.h>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr; using std::cin; using std::cout; using std::endl;
typedef long long ll; typedef unsigned int ui; typedef unsigned long long ull;
using std::make_pair; using std::pair; typedef pair<int, int> pii; typedef pair<int, ll> pil;

typedef double real;

real inline c(real& k, real& b, int x){ return k*x + b; }

struct Node{
    real k, b;
    Node *lc, *rc;
    int l, r;
    inline real get(int x){ return c(this->k, this->b, x); }
    void insert(int l, int r, real k, real b){
        // assert(r >= this->l); assert(l <= this->r);
        int mid = (this->l+this->r)/2;
        if (l <= this->l && this->r <= r){
            if (get(l) >= c(k, b, l) && get(r) >= c(k, b, r)) return;
            // if (l == r && l == 1) cerr << c(k, b, 1) << endl;
            if (get(l) < c(k, b, l) && get(r) < c(k, b, r)){
                this->k = k, this->b = b;
                return;
            }
            real o = get(mid), n = c(k, b, mid);
            if (o <= n) {
                if (this->l == this->r) ;
                else if (k > this->k) lc->insert(l, r, this->k, this->b);
                else rc->insert(l, r, this->k, this->b);
                this->k = k, this->b = b;
            } else {
                if (this->l == this->r) return;
                if (k > this->k) rc->insert(l, r, k, b);
                else lc->insert(l, r, k, b);
            }
            return;
        }
        // cerr << l << ' ' << r << ' ' << this->l << ' ' << this->r << endl;
        // assert(this->l != this->r);
        if (l <= mid) lc->insert(l, r, k, b);
        if (mid < r) rc->insert(l, r, k, b);
    }
    real query(int x){
        real ret = get(x);
        // cerr << x << ' ' << l << ' ' << r << ' ' << get(x) << endl;
        if (l != r){
            if (x <= lc->r) ret = std::max(ret, lc->query(x));
            else ret = std::max(ret, rc->query(x));
        }
        return ret;
    }
} T[100000*4];

Node* tree;

int xa, ya, xb, yb;
void insert(){
    real k, b;
    if (xa == xb){
        k = 0;
        b = std::max(ya, yb);
    } else {
        k = ((real)ya-yb)/(xa-xb);
        b = (real)ya - k * xa;
    }
    if (std::min(xa, xb) > 100000 || std::max(xa, xb) < 1) return;
    tree->insert(std::max(std::min(xa, xb), 1), std::min(std::max(xa, xb), 100000), k, b);
}

int cnt = 0;
Node* build(int l, int r){
    Node* ret = &T[cnt++];
    ret->l = l, ret->r = r; ret->k = 0; ret->b = -1e13;
    if (l != r){
        int mid = (l+r)/2;
        ret->lc = build(l, mid);
        ret->rc = build(mid+1, r);
    }
    return ret;
}

int main() {
#ifdef LOCAL
    freopen("C2.in", "r", stdin);
#endif
    std::ios::sync_with_stdio(0); cout.tie(0);
    int n, m; cin >> n >> m;
    tree = build(1, 100000);
    cerr << "built" << endl;
    rep(i, 1, n){
        cin >> xa >> ya >> xb >> yb;
        insert();
    }
    cerr << "in" << endl;
    cout.setf(std::ios::fixed);
    while(m--){
        int op; cin >> op;
        if (op == 0){
            cin >> xa >> ya >> xb >> yb;
            insert();
        } else {
            int x;
            cin >> x;
            real res = tree->query(x);
            if (res < -1e12) cout << "0\n";
            else cout << std::setprecision(3) << res << '\n';
        }
    }
    return 0;
}
```
