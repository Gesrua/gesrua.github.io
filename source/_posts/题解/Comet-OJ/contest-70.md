---
title: Comet OJ - 模拟赛测试 Day2
tags:
  - 'Comet OJ'
  - 字符串
  - 状态压缩
  - 动态规划
categories:
  - OI
  - 题解
date: 2019-11-12 08:37:16
---

感觉题目出得不是很难，部分分给得很足

<!-- more -->

## A - 收拾房间 reorder

`std::merge()` 秒过

## B - 天天背单词 prefix

长度总和 $N=10^6$

~~我都不敢用 sort~~

God Song 教育我用 suffix array，我不会

假设单词总数为 $n$

字符串比较的复杂度为 $\min(|s_1|,|s_2|)$

那么快速排序的复杂度就是 $n\log n \cdot \frac{N}{n}=N\log n$

不知道这个分析是不是假的

因为不存在某个单词是另一个单词的前缀

就可以用 hash 把单词转成一个序列

就成为了简单题


## C - 养盆栽 monotony

$r,c\le20$ 肯定是状压，考虑状态的设计

基本思想是暴力列，DP 行

暴力枚举 $st$，为保留哪些列

暴力枚举 $s$，为哪些列是单调递增

$s\subseteq st$ 枚举复杂度为 $3^c$

定义 $f(s,i)$ 为以第 $i$ 行结束，并且至少有两行，列状态为 $s$ 的切割方案数

$$
f(s,i)=\sum_{j<i} f(s,j)
$$

如上转移即可得到答案，但复杂度过高

实际上，$s$ 的状态可由两行决定，也就是说其取值方案在 $r^2$ 级别

于是只需要枚举 $st$，$s$ 状态的确定和 DP 转移合在一起为 $r^2$

故复杂度为 $2^cr^2$

## Code

A

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
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

const int N = 1e5+10;

int a[N], b[N], res[N], exi[N];

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    int n, m; io.read(n), io.read(m);
    rep(i, 1, m){
        io.read(a[i]);
        exi[a[i]] = 1;
    }
    int pt = 0;
    rep(i, 1, n) if (exi[i] == 0) b[++pt] = i;
    std::merge(a+1, a+1+m, b+1, b+1+pt, res+1);
    rep(i, 1, n) io.write(res[i], '\n');
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
typedef long long ll; typedef unsigned int ui; typedef unsigned long long ull;
using std::make_pair; using std::pair; typedef pair<int, int> pii; typedef pair<int, ll> pil; typedef pair<ll, ll> pll;
const int N = 1e6+10, p = 1e9+7, base = 29, mod1=998244353, mod2=1e9+7;
ll fac[N], invf[N];

ll ksm(ll a, int n){
    ll ret = 1;
    while(n){
        if (n&1) (ret*=a)%=p;
        n>>=1; (a*=a)%=p;
    }
    return ret;
}

void init(){
    fac[0] = 1;
    rep(i, 1, 1000000) fac[i] = fac[i-1] * i % p;
    invf[1000000] = ksm(fac[1000000], p-2);
    per(i, 999999, 0) invf[i] = invf[i+1]*(i+1)%p;
}

std::string s, a[N];
ll A(int n, int k){ return fac[n]*invf[n-k]%p; }
std::map<pll, int> order;
#define lowbit(i) (i&(-i))
int c[N];
void add(int i, int x){ for(; i<=1000000; i+=lowbit(i)) c[i] += x; }
int ask(int i){int ret = 0; for(; i > 0; i-=lowbit(i)) ret += c[i]; return ret; }

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(0); cout.tie(0);
    init();
    int n, K; cin >> n >> K;
    rep(i, 1, n) cin >> a[i];
    std::sort(a+1, a+1+n);
    rep(i, 1, n){
        ll ret1 = 0, ret2 = 0;
        for(int j = 0; j < a[i].size(); ++j){
            (ret1 = ret1*base+a[i][j]-'a'+1) %= mod1;
            (ret2 = ret2*base+a[i][j]-'a'+1) %= mod2;
        }
        order[pll(ret1, ret2)] = i;
    }
    cin >> s;
    ll ret = 0, ret1 = 0, ret2 = 0; int cnt = 0;
    for(int i = 0; i < s.size(); ++i){
        (ret1 = ret1*base+s[i]-'a'+1) %= mod1;
        (ret2 = ret2*base+s[i]-'a'+1) %= mod2;
        if (order.count(pll(ret1, ret2))){
            ++cnt; int rk = order[pll(ret1, ret2)];
            add(rk, 1);
            (ret += (rk-ask(rk))*A(n-cnt, K-cnt)%p ) %= p;
            ret1 = ret2 = 0;
        }
    }
    ret = (ret+1)%p;
    cout << ret << endl;
    return 0;
}
```

---

C

```cpp
#include <iostream>
#include <cstring>
#define rep(i, l, r) for (int i = (l); i <= (r); ++i)
#define per(i, l, r) for (int i = (l); i >= (r); --i)
using std::cerr; using std::cin; using std::cout; using std::endl;
typedef long long ll; typedef unsigned int ui; typedef unsigned long long ull;

const int R = 20;

int a[R][R], f[1<<R][R], s_all[R][R], valid[R];

int main() {
#ifdef LOCAL
    freopen("input", "r", stdin);
#endif
    std::ios::sync_with_stdio(0); cout.tie(0);
    int r, c; cin >> r >> c;
    rep(i, 0, r-1) rep(j, 0, c-1) cin >> a[i][j];
    ll ret = 0;
    rep(i, 1, r-1){
        rep(j, 0, i-1){
            int s = 0;
            rep(k, 0, c-1) if (a[i][k] > a[j][k]) s |= (1<<k);
            s_all[j][i] = s;
        }
    }
    for(int chs = 1; chs < (1<<c); ++chs){
        rep(i, 0, r-1){
            ++ret; valid[i] = 1;
            int ll = -1, l = -1;
            rep(j, 0, c-1){
                if((1<<j)&chs){
                    if ( ll != -1 &&  !( (ll<l&&l<a[i][j]) || (ll>l&&l>a[i][j]) ) )
                        { --ret; valid[i] = 0; break; }
                    ll = l, l = a[i][j];
                }
            }
        }
        rep(i, 1, r-1){
            if (!valid[i]) continue;
            rep(j, i+1, r-1) if (valid[j]) f[chs&s_all[i][j]][i] = 0;
            rep(j, 0, i-1){
                if (!valid[j]) continue;
                int s = (chs&s_all[j][i]);
                f[s][i] += f[s][j] + 1;
                ret += f[s][j]+1;
            }
        }
    }
    cout << ret << endl;
    return 0;
}
```
