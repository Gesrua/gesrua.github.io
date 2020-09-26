---
title: Edmonds-Karp 算法
tags:
  - 最大流
  - 学习笔记
  - 算法
  - 网络流
categories:
  - OI
date: 2019-01-04 17:45:42
---

Edmonds-Karp 算法是用来解决最大流和最小费用最大流的常用算法。

## 原理

对于一个图（流量/容量）

![maxflow](/images/maxflow.svg)

显然最大流为 $2$

<!-- more -->

我们考虑贪心，每次找出一条增广路

![maxflow_wa](/images/maxflow_wa.svg)

并没有得到最优解

是不是忘了什么？

$f$ 有反对称性

![maxflow_ac1](/images/maxflow_ac1.svg)

我们发现还有一条增广

![maxflow_ac2](/images/maxflow_ac2.svg)

于是得到了正解

如果我们以 $c_f$ 绘图，可能更简洁一些

![maxflowcf1](/images/maxflowcf1.svg)

![maxflowcf2](/images/maxflowcf2.svg)

![maxflowcf3](/images/maxflowcf3.svg)

:::info
在我的理解中，反向边就是给了一个反悔的机会
:::

## 最大流

### 实现

我们可以对一个边存 $f, c$，或者可以只存 $c_f$，因为保证 $c_f>0$ 就可以满足 $f\le c$ 的条件

如何寻找增广路呢？

可以发现 dfs 是不行的，因为可能有环存在。

于是可以用 bfs

代码中采用记录 $c_f$

对于反向边的记录，我们可以直接在 `struct edge` 中开指针指向反向边

或者用 `xor` 成对储存的技巧：

```
0 xor 1 = 1
1 xor 1 = 0
2 xor 1 = 3
3 xor 1 = 2
```

```cpp
#include <iostream>
#include <cstring>
#define rep(i, l, r) for (int i = (l); i < (r); ++i)
using std::cin; using std::cout; using std::cerr; using std::endl;

const int N = 10000, M = 100000, INF = 1e8;

#define travese(i, u) for(edge* i = p[u]; i; i = i->nxt)

int n, m, s, t;

struct edge;

edge* begin;

struct edge{
    edge* nxt;
    int v, cap;
    edge* rev(){ // 求反向边
        return begin + ((this-begin)^1);
    }
}e[M*2+100];

edge* p[N+100];

int cnt = 0;

inline void addedge(int u, int v, int cap){
    e[cnt].v = v, e[cnt].cap = cap, e[cnt].nxt = p[u], p[u] = &e[cnt++];
}

struct que{
    int a[N+100], l = 0, r = 0;
    int front() {return a[l];}
    void pop() { ++l;}
    bool empty() {return l >= r; }
    void push(int x){
        a[r++] = x;
    }
    void clear(){
        l = 0, r = 0;
    }
} q;

struct node{
    edge* e;
    int v;
} pre[N+100];
bool flag[N+100];

bool bfs(){ // 求增广路
    std::memset(flag, 0, sizeof(flag)); // vis 标记
    flag[s] = 1;
    q.clear();
    q.push(s);
    while(!q.empty()){
        int u = q.front(); q.pop();
        travese(i, u){
            if (i->v == t && i->cap > 0){
                pre[i->v].v = u;
                pre[i->v].e = i;
                return 1;
            }
            if (flag[i->v]) continue;
            if (i->cap > 0){
                pre[i->v].v = u;
                pre[i->v].e = i;
                q.push(i->v);
                flag[i->v] = 1;
            }
        }
    }
    return 0;
}

int main(){
    std::ios::sync_with_stdio(false);
    cout.tie(0);
    begin = e;
    cin >> n >> m >> s >> t;
    rep(i, 0, m){
        int u, v, cap;
        cin >> u >> v >> cap;
        addedge(u, v, cap);
        addedge(v, u, 0);
    }
    int maxflow = 0;
    while(bfs()){
        int delta = INF;
        for(int i = t; i != s; i = pre[i].v){
            delta = std::min(delta, pre[i].e->cap);
        }
        for(int i = t; i != s; i = pre[i].v){
            pre[i].e->cap -= delta;
            pre[i].e->rev()->cap += delta;
        }
        maxflow += delta;
    }
    cout << maxflow;
    return 0;
}
```

### 复杂度

https://brilliant.org/wiki/edmonds-karp-algorithm/
