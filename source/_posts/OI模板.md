---
title: OI模板
date: 2019-04-05 21:46:50
tags:
categories:
    - OI

---

flag: 我有一天我会写出两个头文件

- `advanced_data_structure.h`
- `algorithm++.h`

<!-- more -->

# 数据结构

## 前缀和

$$
s_i = \sum_{k=1}^{i} a_i
$$

```cpp
int s[1000];
for (int i = 1; i <= n; ++i){
    s[i] = s[i-1] + a[i];
}
```

## 差分

令 $a_0 = 0$

$$
c_i = a_i - a_{i-1}
$$

## 线段树

## 树状数组

### 基本版

```cpp
struct BIT{
    int c[N];
    int lowbit(int x){return x&-x;}
    void add(int pos, int x){
        for (int i = pos; i <= n; i += lowbit(i))
            c[i] += x;
    }
    int sum(int n){
        int ret = 0;
        for (int i = n; i > 0; i -= lowbit(i))
            ret += c[i];
        return ret;
    }
    int query(int l, int r){
        return sum(r) - sum(l-1);
};
```

### 加强版

```cpp
struct EXBIT{
    BIT t, s;
    void init(int pos, int add){
        s.add(pos, add);
        t.add(pos, (pos-1)*add);
    }
    void add(int l, int r, int x){
        s.add(l, x);
        s.add(r+1, -x);
        t.add(l, (l-1)*x);
        t.add(r+1, -r*x);
    }
    int _ask(int r){
        if (r <= 0) return 0;
        return r*s.sum(r) - t.sum(r);
    }
    int ask(int l, int r){
        return _ask(r) - _ask(l-1);
    }
};
```

# 图论

## 最短路

### Floyd

```cpp
rep(k, 1, n) rep(u, 1, n) rep(v, 1, n)
    g[u][v] = min(g[u][v], g[u][k] + g[k][v])
```

### Dijkstra

## 网络流

```cpp
struct Edge {
    int v, cap;
    Edge *nxt, *rev;
} e[M];
Edge* p[N]; int cnt = 0;
void addedge(int u, int v, int cap) {
    e[cnt] = (Edge){v, cap, p[u], &e[cnt + 1]};
    p[u] = &e[cnt++];
    e[cnt] = (Edge){u, 0, p[v], &e[cnt - 1]};
    p[v] = &e[cnt++];
}
```

### 最大流

#### Edmonds-Karp

```cpp
struct node {
    edge* e;
    int v;
} pre[N];

bool bfs() {
    std::memset(flag, 0, sizeof(flag));
    flag[s] = 1;
    q.clear();
    q.push(s);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        travese(i, u) {
            if (i->v == t && i->cap > 0) {
                pre[i->v].v = u;
                pre[i->v].e = i;
                return 1;
            }
            if (flag[i->v]) continue;
            if (i->cap > 0) {
                pre[i->v].v = u;
                pre[i->v].e = i;
                q.push(i->v);
                flag[i->v] = 1;
            }
        }
    }
    return 0;
}

int maxflow = 0;
while (bfs()) {
    int delta = INF;
    for (int i = t; i != s; i = pre[i].v) {
        delta = std::min(delta, pre[i].e->cap);
    }
    for (int i = t; i != s; i = pre[i].v) {
        pre[i].e->cap -= delta;
        pre[i].e->rev->cap += delta;
    }
    maxflow += delta;
}
cout << maxflow;
```

#### Dinic

```cpp
Edge *cur[N]; int dep[N];

bool bfs() {
    rep(i, 0, cnt) cur[i] = p[i];
    std::memset(dep, 0, sizeof(dep));
    dep[s] = 1;
    std::queue<int> q;
    q.push(s);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (auto i = p[u]; i; i = i->nxt) {
            if (i->cap > 0 && !dep[i->v]) dep[i->v] = dep[u] + 1, q.push(i->v);
        }
    }
    return dep[t];
}

int dfs(int u, int pre) {
    int flow = 0, delta;
    if (u == t || pre <= 0) return pre;
    for (auto i = cur[u]; i; cur[u] = i = i->nxt) {
        if (i->cap <= 0 || dep[i->v] != dep[u] + 1) continue;
        delta = dfs(i->v, std::min(pre, i->cap));
        i->cap -= delta;
        i->rev->cap += delta;
        flow += delta;
        pre -= delta;
        if (pre == 0) break;
    }
    return flow;
}

int maxflow() {
    int flow = 0;
    while (bfs()) {
        flow += dfs(s, inf);
    }
    return flow;
}
```


# 数学

## 快速幂 ~~卡速米~~

```cpp
ll ksm(ll a, ll n, ll p) {
    ll ret = 1;
    a %= p;
    while (n) {
        if (n & 1) {
            (ret *= a) %= p;
        }
        n >>= 1;
        (a *= a) %= p;
    }
    return ret;
}
```

## 矩阵

```cpp
struct matrix {
    int MOD = 1000000007, a[110][110], m, n; // edit
    void init(const int &nM, const int &nN){
        std::memset(this->a, 0, sizeof(this->a));
        this->m = nM;
        this->n = nN;
    }
    matrix operator=(const matrix &s){
        this->init(s.m, s.n);
        for (int i = 0; i <= s.m; ++i)
            for (int j = 0; j <= s.n; ++j)
                this->a[i][j] = s.a[i][j];
        return *this;
    }
    matrix operator*(const matrix &s){
        matrix ans;
        ans.init(this->m, s.n);
        for (int i = 1; i <= this->m; ++i){
            for (int j = 1; j <= s.n; ++j){
                for (int k = 1; k <= this->n; ++k){
                    ans.a[i][j] += (long long)this->a[i][k]%MOD*((long long)s.a[k][j]%MOD)%MOD;
                }
            }
        }
        return ans;
    }
};
std::ostream& operator<<(std::ostream &out, const matrix &s){
    for (int i = 1; i <= s.m; ++i){
        out << '[';
        for (int j = 1; j <= s.n-1; ++j){
            out << s.a[i][j] << ' ';
        }
        out << s.a[i][s.n];
        out << "]\n";
    }
    return out;
}
```

## FFT 快速傅里叶变换

## NTT 数论变换

## 扩展欧几里得

$$
ax + by = \gcd(a,b) = \gcd(b, a\% b) = bx'+(a\%b)y' = bx' +(a-\lfloor \frac{a}{b}\rfloor*b)y'
$$

整理

$$
a(x-y')+b(y-x'+\lfloor\frac{a}{b}\rfloor) = 0
$$

一组显然的解是

$$
\left\{
\begin{aligned}
x &= y'\\
y &= x'-\lfloor\frac{a}{b}\rfloor y'
\end{aligned}
\right.
$$

$b = 0$ 时，解为 $\left\{
\begin{aligned}
x &= a'\\
y &= 0
\end{aligned}
\right.$

递归处理即可

## 乘法逆元

$p$ 为质数，有 $a^{p-2} \times a = 1 \mod{p}$ 故可用快速幂处理