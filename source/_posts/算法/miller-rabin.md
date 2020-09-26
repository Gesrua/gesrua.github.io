---
title: Miller Rabin 判素
tags:
  - 数论
  - 素数
  - 算法
  - 学习笔记
categories:
  - OI
date: 2019-05-18 23:45:24
---

## 数学

### 费马小定理

对于素数 $p$ 必存在

$$
a^{p-1} \equiv 1 \pmod{p}
$$

所以可以随机选取 $a\in[2,n-1]$ 检验是否满足上式，若不满足，则必然是合数

遗憾的是，存在无穷多个 $n$，可以满足

$$
\forall\ x\in[2,n-1]\\
x^{n-1}\equiv 1 \pmod{n}
$$

也就是说使费马判素失效

### 二次探测定理

素数 $p$ 必满足方程

$$
x^2\equiv1\pmod{p}
$$

有且仅有两个解


$$
x_1\equiv1,\ x_2\equiv p-1\pmod{p} 
$$

## 实现

把 $n-1$ 分解成 $d\cdot2^t$ 使 $t$ 尽量大

然后 $x\equiv base^{d} \pmod{n}$ 

然后不断进行二次探测

即如果满足 $x\not\equiv 1$ 且 $x\not\equiv n-1$ 且 $x^2\equiv 1$ 那么这个数解不是素数了

最后进行费马判素

```cpp
bool miller_rabin(ll n) {
    if (n <= 2) return n == 2;
    int d = n - 1, t = 0;
    while (d % 2 == 0) d /= 2, ++t;
    rep(i, 0, T) { // T 是测试次数, p 是测试基
        ll x = ksm(p[i] % (n - 2) + 2, d, n);
        if (x == 1 || x == n - 1) continue; // 无效的二次探测
        for (int j = 0; j < t; ++j, x = x * x % n)
            if (x != n - 1 && x != 1 && x * x % n == 1) return 0;
        if (x != 1) return 0; // 费马判素
    }
    return 1;
}
```

这是测试基选择的推荐

| 数据范围 |             测试基              |
| -------: | :-----------------------------: |
| $2^{32}$ |             2,7,61              |
| $2^{64}$ | 2,3,5,7,11,13,17,19,23,29,31,37 |

