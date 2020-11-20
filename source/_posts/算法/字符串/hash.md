---
title: 字符串 Hash
tags:
  - Hash
  - 算法
  - 字符串
categories:
  - OI
  - 学习笔记
date: 2019-05-02 22:11:45
---

## 概述

你有一个字符串 $s$ 你有一个神奇的函数 $f$ 可以使

- $f(s)\in R$
- $s_1 \neq s_2$ 时基本上不会出现 $f(s_1)=f(s_2)$

一种常见的 $f$ 构造方法是 

$$
f(s)=\sum_{i=1}^n s_i\cdot ratio^{n-i}
$$

<!-- more -->

```cpp
rep(i, 1, n)
    ret = ret * ratio + s[i];
```

:::warning

按这种方法构造 $s_1\neq s_2$ 时必有 $f(s_1)\neq f(s_2)$

但是并不能存一个很大很大的数

故需要对一个数取模

通常是质数

而且我们还可以对两个数取模

这样冲突的概率非常小

:::

这种构造方法的好处显而易见

- $O(1)$ 取字串
- 数列骚操作

具体技巧在例题

## 例题

### 子串查找

:::success

[LOJ #103. 子串查找](<https://loj.ac/problem/103>)

这是一道模板题。

给定一个字符串  $A$ 和一个字符串 $B$ ，求 $B$ 在 $A$ 中的出现次数。$A$ 和 $B$ 中的字符均为英语大写字母或小写字母。

$A$ 中不同位置出现的 $B$ 可重叠。

:::

```cpp
rep(i, 1, n)
    (h[i] = h[i - 1] * ratio + s[i]) %= p;
```

那么取 $s_{l+1}\cdots s_r$ 的方法是 $h_r-h_l\cdot ratio^{r-l}$

### 图书管理

:::success

[LOJ #10034. 「一本通 2.1 例 2」图书管理](https://loj.ac/problem/10034)

图书管理是一件十分繁杂的工作，在一个图书馆中每天都会有许多新书加入。为了更方便的管理图书（以便于帮助想要借书的客人快速查找他们是否有他们所需要的书），我们需要设计一个图书查找系统。

该系统需要支持 2 种操作：

1. `add(s)` 表示新加入一本书名为 s 的图书。
2. `find(s)` 表示查询是否存在一本书名为 s 的图书。

:::

算出 $f(s)$ 丢到 map 里去

### Power Strings

:::success

[LOJ #10035. 「一本通 2.1 练习 1」Power Strings](https://loj.ac/problem/10035)

给定若干个长度 $\le 10^6$ 的字符串，询问每个字符串最多是由多少个相同的子字符串重复连接而成的。如：`ababab` 则最多有  个 `ab` 连接而成。

:::

这是一个等比数列求和的问题

### Seek the Name, Seek the Fame

:::success

[LOJ #10036. 「一本通 2.1 练习 2」Seek the Name, Seek the Fame](https://loj.ac/problem/10036)

给定若干字符串（这些字符串总长 $\le 4\times10^5$），在每个字符串中求出所有既是前缀又是后缀的子串长度。

例如：`ababcababababcabab`，既是前缀又是后缀的：`ab`，`abab`，`ababcabab`，`ababcababababcabab`。

:::

从两边分别算 Hash 就可以了