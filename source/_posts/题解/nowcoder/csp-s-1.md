---
title: 牛客 CSP-S 提高组赛前集训营 1 题解
tags:
  - 图论
  - 动态规划
  - 树形DP
  - 博弈论
  - 牛客
categories:
  - OI
  - 题解
date: 2019-10-30 09:08:03
---

体验还是比较好的 ~~230 只有 100 名差评~~，没有享受到大样例x

## 比赛实录

6:30：看 T1，这个博弈我好像推不出来SG，这是 ICG 吗？

滚去看 T2，理解题意 5min ，这个乘积怎么维护啊。。。

DP式子推推搞搞搞

<!-- more -->

宋神 A T1 了

继续搞搞搞

过样例了

跑一组大数据

woc 忘记取模了

修修修

怎么还是负数x

`%=` 写成 `%` 了

终于得到一个看起来还不错的结果

宋神也写完 T2 了

传过去，对拍ing

过了.jpg

~~宋神 T1 代码传我~~

搞 T3

这个数据结构我不会啊。。

诶，这好像是图论

边连一连搞搞环行不行啊 ~~这不就是正解吗 QAQ~~

好像不行x

拿个网络流板子写个 30pt

要下课了第四个数据不写了x

回寝室，10:03看榜，竟然没挂分，怎么只有 100 名 QAQ

## 题解

### 仓鼠的石子游戏

先讨论一堆

石子数为 $1$ 时先手赢， 否则后手赢

可以想成 $>1$ 时，先手作出了操作，后手一定有方案应对，最后肯定是先手不能放

扩展到 $n$ 堆

```cpp
for(int i = 1; i <= n; ++i)
    s ^= (a[i] == 1);
cout << (s?"rabbit\n":"hamster\n");
```

### 乃爱与城市拥挤程度

$f_{u,i}$ 为 $u$ 的子树中，$k=i$ 时有多少座城市中的人会认为乃爱天下第一（第一行答案）

$h_{u,i}$ 为 $u$ 的子树中，$k=i$ 时受到影响城市的拥挤程度的乘积（第二行答案）

$$
f_{u,i}=1+\sum_{u\rightarrow v} f_{v,i-1}
$$

$$
h_{u,i}=f_{u,i}\cdot \prod_{u\rightarrow v} h_{v,i-1}
$$

我写的是换根，不会 up and down QAQ

$topf_u$ 表示除去子树 $u$ 后，把 $u$ 的父节点作为根得到的 $f$，$toph$ 同理

$$
topf_{v,i}=f_{u,i}+topf_{u,i-1}-f_{v,i-1}
$$

$$
toph_{v,i}=\frac{toph_{u,i-1}h_{u,i}}{h_{v,i-1}}\cdot \frac{topf_{u,i-1}+f_{u,i}-f_{v,i-1}}{f_{u,i}}
$$

### 小w的魔术扑克

将数字看作节点，牌看作无向边

考虑一个有 $n$ 个点，$m$ 条边的连通块

当 $m\ge n$ 时，连通块的点都可以选中

当 $m=n-1$ 时，必有一个点不能被选中

由于询问的是连续值域，所以只要记录每个连通块的最大值和最小值

若存在一个连通块的最大值和最小值都在询问区间中，就是 No，否则是 Yes

对于这种询问可以离线询问，把询问和连通块按照右端点排序，只要维护 $maxl$ 即可

### Code

A

```cpp
#include <bits/stdc++.h>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr; using std::cin; using std::cout; using std::endl;
using std::make_pair; using std::pair; typedef pair<int, int> pii;
typedef long long ll; typedef unsigned int ui; typedef unsigned long long ull;

const int N = 1e3 + 10;
int a[N];

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(0); cout.tie(0);
    int T;
    cin >> T;
    while(T--){
        int n;
        cin >> n;
        rep(i, 1, n) cin >> a[i];
        int s = 0;
        rep(i, 1, n) s ^= (a[i] == 1);
        cout << (s?"rabbit\n":"hamster\n");
    }
    return 0;
}
```

---

B

```cpp
#include <bits/stdc++.h>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr; using std::cin; using std::cout; using std::endl;
using std::make_pair; using std::pair; typedef pair<int, int> pii;
typedef long long ll; typedef unsigned int ui; typedef unsigned long long ull;

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

const int N = 1e5 + 10, p = 1e9+7;

int n, K;
std::vector<int> g[N];
int f[N][12];
ll h[N][12];

int inv(ll a){
    ll ret = 1;
    int n = p - 2;
    while(n){
        if (n&1) (ret *= a) %= p;
        (a *= a) %= p;
        n >>= 1;
    }
    return ret;
}

void dfs1(int u, int fa){
    // cerr << u << endl;
    rep(k, 0, K) f[u][k] = h[u][k] = 1;
    if (g[u].size() == 1 && fa != 0) return;
    
    for (auto v : g[u]){
        if (v == fa) continue;
        dfs1(v, u);
        rep(k, 1, K){
            f[u][k] += f[v][k-1], (h[u][k] *= h[v][k-1])%=p;
        }
    }
    rep(k, 0, K) (h[u][k] *= f[u][k])%=p;
}

int ans1[N]; ll ans2[N];
int topf[N][12], tmpf[12];
ll toph[N][12];

void calc(int u, int fa){
    ans1[u] = topf[u][K-1] + f[u][K];
    ans2[u] = h[u][K] * toph[u][K-1] % p * ans1[u] % p * inv(f[u][K]) % p;
    tmpf[0] = 1;
    for(auto v : g[u]){
        if (v == fa) continue;
        topf[v][0] = 1;
        rep(k, 1, K) topf[v][k] = f[u][k] + topf[u][k-1] - f[v][k-1];

        toph[v][0] = 1;
        rep(k, 1, K){
            toph[v][k] = toph[u][k-1] * h[u][k] % p * (topf[u][k-1] + f[u][k] - f[v][k-1]) % p * inv(h[v][k-1]) % p * inv(f[u][k]) % p;
        }
    }

    for(auto v : g[u]){
        if (v == fa) continue;
        calc(v, u);
    }
}

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(0); cout.tie(0);

    // cin >> n >> K;
    io.read(n), io.read(K);
    rep(i, 2, n){
        int u, v;
        io.read(u), io.read(v);
        g[u].push_back(v), g[v].push_back(u);
    }

    dfs1(1, 0);

    // rep(k, 0, K){
    //     rep(i, 1, n)
    //         cerr << f[i][k] << ' '; cerr << endl;
    // }
    // rep(k, 0, K){
    //     rep(i, 1, n)
    //         cerr << h[i][k] << ' '; cerr << endl;
    // }

    rep(k, 0, K) toph[1][k] = 1;
    calc(1, 0);

    // rep(k, 0, K) cerr << toph[2][k] << ' '; cerr << endl;

    rep(i, 1, n)
        // cout << ans1[i] << ' ';
        io.write(ans1[i], ' ');
    // cout << endl;
    io.push('\n');
    rep(i, 1, n)
        io.write(ans2[i], ' ');
        // cout << ans2[i] << ' ';
    // cout << endl;
    io.push('\n');
    return 0;
}
```

---

C

```cpp
#include <bits/stdc++.h>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr; using std::cin; using std::cout; using std::endl;
using std::make_pair; using std::pair; typedef pair<int, int> pii;
typedef long long ll; typedef unsigned int ui; typedef unsigned long long ull;
const int N = 1e5 + 10;
int fa[N];
int getf(int x){ return (x == fa[x])?x:(fa[x]=getf(fa[x])); }
std::vector<int> g[N];
int tag[N], min, max;
void dfs(int u){
    min = std::min(min, u);
    max = std::max(max, u);
    tag[u] = 1;
    for(auto v : g[u]) if (!tag[v]) dfs(v);
}
struct A{
    int l, r, id;
    A(){ l = r = id = 0; }
    A(int l, int r, int id){ this->l = l, this->r = r, this->id = id; }
};
int ans[N];
bool cmp_r_A(const A& a, const A& b){ return a.r < b.r; }
bool cmp_r_pii(const pii& a, const pii& b){ return a.second < b.second; }
int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(0); cout.tie(0);
    int n, k; cin >> n >> k; rep(i, 1, n) fa[i] = i;
    std::vector<int> loop;
    rep(i, 1, k){
        int u, v;
        cin >> u >> v;
        if (getf(u) == getf(v)){
            loop.push_back(u);
        } else {
            fa[getf(u)] = getf(v);
            g[u].push_back(v), g[v].push_back(u);
        }
    }
    for(auto u : loop)
        if (!tag[u]) dfs(u);
    std::vector<pii> seg;
    rep(u, 1, n){
        if (!tag[u]) {
            min = n + 1, max = 0;
            dfs(u);
            assert(min <= n);
            assert(max > 0);
            seg.push_back({min, max});
        }
    }
    int q;
    cin >> q;
    std::vector<A> ask;
    rep(i, 1, q){
        int u, v; cin >> u >> v;
        if (u > v) std::swap(u, v);
        ask.push_back(A(u, v, i));
    }
    std::sort(seg.begin(), seg.end(), cmp_r_pii); std::sort(ask.begin(), ask.end(), cmp_r_A);
    for(int i = 0, j = 0, maxl = 0; i < ask.size(); ++i){
        for(; j < seg.size() && seg[j].second <= ask[i].r; ++j) maxl = std::max(maxl, seg[j].first);
        if (maxl >= ask[i].l) ans[ask[i].id] = 1;
    }
    rep(i, 1, q) cout << (ans[i]?"No\n":"Yes\n");
    return 0;
}
```
