---
title: 快速傅里叶变换 Fast Fourier Transform
tags:
  - 学习笔记
  - 算法
categories:
  - OI
typora-root-url: ../..
date: 2019-02-10 12:09:23
---

## 前置技能

### 虚数

$$
i^2 = -1\\
i = \sqrt{-1}
$$

### 复数

任意复数 $z$ 都可表示为 $a+bi(a,b\in R)$

$a$ 叫做实部，定义 $\mathrm{Re}(z) = a$

$b​$ 叫做虚部，定义 $\mathrm{Im}(z) = b​$

<!-- more -->

#### 复平面

实数只有一根数轴

现在不够用了，于是我们再加一条

画一个平面直角坐标系，横轴定义为**实轴**，纵轴定义为**虚轴**

![A complex number z, as a point (red) and its position vector (blue)](/images/A_plus_bi.svg)

对于一个复数 $z=a+bi$，有如下定义

- 模 $r=\left| z \right| = \sqrt{a^2+b^2}$
- 辐角 $\varphi = \arg z$ 与实轴正方向的角度

于是可以得到 $z=r(\cos\varphi+i\sin\varphi)$

![Complex](/images/Complex_number_illustration_modarg.svg)

:::success
可以类比向量
:::

#### 运算规律

$z_1=a+bi, z_2=c+di$

##### 加减

$$
z_1+z_2=(a+c)+(b+d)i\\
-z_2=-c-di\\
z_1-z_2=z_1+(-z_2)
$$

复平面上类比向量加减

##### 乘法

$$
\varphi_1=\arg z_1\\
\varphi_2=\arg z_2\\
r_1=\left| z_1 \right|\\
r_2=\left| z_2 \right|\\
\begin{aligned}
z_1\times z_2 &= (a+bi)(c+di)\\
&= (ac-bd)+(ad+bc)i\\
&= r_1(\cos\varphi_1+i\sin\varphi_1)
r_2(\cos\varphi_2+i\sin\varphi_2)\\
&=r_1r_2\big((\cos\varphi_1\cos\varphi_2-\sin\varphi_1\sin\varphi_2)+i(\sin\varphi_1\cos\varphi_2+\cos\varphi_1\sin\varphi_2)\big)\\
&=r_1r_2\big(\cos(\varphi_1+\varphi_2)+i\sin(\varphi_1+\varphi_2)\big)
\end{aligned}
$$

复平面上，复数相乘，**幅角相加，模相乘**

#### 单位根

对于方程

$$
x^n=1
$$

我们有 $n​$ 个复数域上的解

在复平面上，这些点都落在单位圆上，它们将圆 $n​$ 等分

定义 $\omega_n=\cos\frac{2\pi}{n}+i\sin\frac{2\pi}{n}$

$$
\omega_n^k = (\omega_n)^k = \cos\frac{2\pi k}{n}+i\sin\frac{2\pi k}{n}
$$

以 $x^5=1$ 为例

![Roots](/images/5roots.svg)

##### 性质

- $\omega_{2n}^{2k}=\omega_n^k$
- $\omega_n^{n/2}=-1$

### 多项式

$$
F(x)=\sum_{i=0}^{n-1}a_ix^i
$$

#### 代数基本定理

>  一个 $n$ 次多项式，在复数域上恰有 $n$ 个根

#### 点值表示

选择 $n$ 个互不相同的数带入可得到许多点值

$$
(x_1,y_1),(x_2,y_2)\cdots(x_n,y_n)
$$

根据 $n$ 个点，我们同样可以确定一个唯一的 $n-1$ 次多项式

##### 证明

:::success
假设同时有两个不相同多项式 $A(x),B(x)$ 满足 $\forall i\in[1,n],A(x)=B(x)=y_i$

那么对于 $C(x)=A(x)-B(x)$ 则有 $n$ 个根，而 $C(x)$ 为 $n-1$ 次多项式

矛盾
:::

## 快速傅里叶变换 FFT

### 离散傅里叶变换 DFT

> 已知多项式系数求点值表达

$n$ 为 $2$ 的整数次幂

$$
\begin{aligned}
F(x)&=\sum_{i=0}^{n-1}a_ix^i\\
e.g.\quad F(x)&=a_3x^3+a_2x^2+a_1x+a_0\\\\
A(x)&=\sum_{i=0}^{n/2-1}a_{2i}x^{2i}\\
e.g.\quad A(x)&=a_2x^2+a_0\\\\
B(x)&=\sum_{i=0}^{n/2-1} a_{2i+1}x^{2i}\\
e.g.\quad B(x)&=a_3x^2+a_1\\\\
F(x)&=A(x)+xB(x)\\
e.g.\quad F(x)&=a_2x^2+a_0+x(a_3x^2+a_1)\\\\
\forall \quad k&\in[1,n/2]\\
F(\omega_n^k)&=A(\omega_n^k)+\omega_n^kB(\omega_n^k)\\
\because \omega_n^{k+n/2}&=\omega_n^k\omega_n^{n/2}=-\omega_n^k \\
F(\omega_n^{k+n/2})&=A(\omega_n^{k+n/2})+\omega_n^{k+n/2}B(\omega_n^{k+n/2})\\
&= A(\omega_n^k)-\omega_n^kB(\omega_n^k)
\end{aligned}\\
$$

复杂度分析 $\mathrm{DFT}(n)=2\mathrm{DFT}(n/2)+O(n)=O(n\log n)$

### 逆离散傅里叶变换 IDFT

> 已知点值表达求系数表达

$$
b_i=F(\omega_n^i)\\\\
\begin{aligned}
c_k&=\sum_{i=1}^nb_i(\omega_n^{-k})^i\\
&=\sum_{i=1}^n(\sum_{j=0}^{n-1}a_j(\omega_n^i)^j)(\omega_n^{-k})^i\\
&=\sum_{i=1}^n\sum_{j=0}^{n-1}a_j(\omega_n^{j-k})^i\\
&=\sum_{j=0}^{n-1}\sum_{i=1}^na_j(\omega_n^{j-k})^i\\
&=\sum_{j=0}^{n-1}\bigg(a_j\sum_{i=1}^n(\omega_n^{j-k})^i\bigg)\\
\end{aligned}\\
\begin{aligned}\\\\
S(\omega_n^k)&=\omega_n^k+(\omega_n^k)^2+\cdots+(\omega_n^k)
^n\\
&=\left\{
\begin{aligned}
\frac{\omega_n^k-(\omega_n^k)
^n\cdot\omega_n^k}{1-\omega_n^k}=0, \omega_n^k=\not1\\
n, \omega_n^k=1
\end{aligned}
\right.\\\\
\end{aligned}\\
\begin{aligned}
c_k&=\sum_{j=0}^{n-1}a_jS(\omega_n^{j-k})\\
&=na_k\\
\end{aligned}\\
\therefore \quad a_k=\frac{1}{n}c_k
$$

我们知道了点值 $b_i$ 可以通过和 DFT 类似的方法求出 $c_k$

然后 $a_k=\frac{1}{n}c_k$ 就求出了系数表达

[^1]: [From Wikipedia](https://en.wikipedia.org/wiki/Complex_number#Cartesian_complex_plane)

