---
title: acejudge 教程
tags:
  - 乱七八糟
categories:
  - OI
date: 2019-04-05 17:08:11
---

A simple terminal OI/ACM answer checker on Linux/UNIX

[acejudge](https://github.com/laekov/acejudge) 是一个命令行的 judger

因为没有文档，所以写了一个指南

# 安装

```shell
git clone git@github.com:laekov/acejudge.git && cd acejudge
make && sudo make install
```

# 使用

### 配置文件

假定配置文件名为 `w.cfg`

```
一个 printf 式的格式化字符串作为输入文件
一个 printf 式的格式化字符串作为答案文件
第一个数据编号 最后一个数据编号 时间(ms) 内存(MB)
源程序名 
```

<!-- more -->

:::info

当输入文件为 `1.in 2.in ... 10.in` 答案文件为 `1.out 2.out ... 10.out`

```
%d.in
%d.out
1 10 2000 512
a.cpp
```
:::

:::info

当数据放在 `/tmp` 文件夹，输入文件为 `dat1.in dat2.in ... dat20.in` 答案文件为 `dat1.out dat2.out ... dat20.out`

```
/tmp/dat%d.in
/tmp/dat%d.out
1 20 2000 512
a.cpp
```
:::

`acejudge -fast w.cfg` 来运行


### 例子

acejudge 也提供交互实现配置

<pre>╭─<font color="#3F953A"><b>chaigidel@chaigidel-pc</b></font> <font color="#2F5AF3"><b>/tmp/rec</b></font>  
╰─<font color="#2A2C33"><b>$</b></font> <font color="#3F953A">ls</font>
10.in  10.out  1.in  1.out  2.in  2.out  3.in  3.out  4.in  4.out  5.in  5.out  6.in  6.out  7.in  7.out  8.in  8.out  9.in  9.out  a.cpp
╭─<font color="#3F953A"><b>chaigidel@chaigidel-pc</b></font> <font color="#2F5AF3"><b>/tmp/rec</b></font>  
╰─<font color="#2A2C33"><b>$</b></font> <font color="#3F953A">acejudge</font>     
<span style="background-color:#3F953A"><font color="#000000">Ace Judge</font></span> V3.0 Beta3 <font color="#950095">(Released 01/04 2015) </font>
			<font color="#2F5AF3">by CDQZ_</font><font color="#DE3E35">l</font><font color="#3F953A">a</font><font color="#D2B67C">e</font><font color="#2F5AF3">k</font><font color="#950095">o</font><font color="#3F953A">v</font> 
C - Configure
R - Run
Q - Quit
c
C - Config problem
L - Show cfg now
E - Load existing cfg file
W - Save cfg file
c
<font color="#D2B67C">IO data format</font>
<font color="#950095">%d</font>
<font color="#D2B67C">Input data sufix</font>
<font color="#950095">.in</font>
<font color="#D2B67C">Output data sufix</font>
<font color="#950095">.out</font>
<font color="#D2B67C">Begin - End</font>
<font color="#950095">1 10</font>
<font color="#D2B67C">Time limit(ms)</font>
<font color="#950095">2000</font>
<font color="#D2B67C">Memory limit(MB)</font>
<font color="#950095">512</font>
<span style="background-color:#3F953A"><font color="#000000">Ace Judge</font></span> V3.0 Beta3 <font color="#950095">(Released 01/04 2015) </font>
			<font color="#2F5AF3">by CDQZ_</font><font color="#DE3E35">l</font><font color="#3F953A">a</font><font color="#D2B67C">e</font><font color="#2F5AF3">k</font><font color="#950095">o</font><font color="#3F953A">v</font> 
C - Configure
R - Run
Q - Quit
c
C - Config problem
L - Show cfg now
E - Load existing cfg file
W - Save cfg file
w
Cfg file name:
<font color="#950095">w.cfg</font>
<span style="background-color:#3F953A"><font color="#000000">Ace Judge</font></span> V3.0 Beta3 <font color="#950095">(Released 01/04 2015) </font>
			<font color="#2F5AF3">by CDQZ_</font><font color="#DE3E35">l</font><font color="#3F953A">a</font><font color="#D2B67C">e</font><font color="#2F5AF3">k</font><font color="#950095">o</font><font color="#3F953A">v</font> 
C - Configure
R - Run
Q - Quit
r
<font color="#D2B67C">Program name</font>
<font color="#950095">a.cpp</font>
<font color="#D2B67C">Testing program: </font><font color="#950095">a.cpp</font>
<font color="#3F953A">Compile ok</font>
<font color="#3F953A">Test case 1</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1213</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">65116</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 2</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">206</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">9488</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 3</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">325</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">9492</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 4</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">15</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">9280</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 5</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1428</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">60760</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 6</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1832</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">60308</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 7</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">19</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">9224</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 8</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1918</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">60328</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 9</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1352</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">60348</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 10</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1337</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">60132</font><font color="#D2B67C"> KB</font>
<font color="#2F5AF3">Score ratio: </font><font color="#3F953A">100.00%</font>
Valid time used: <font color="#950095">9645</font> ms	Max memory used: <font color="#950095">65116</font> KB
<font color="#3F953A">Press any key to continue</font>
<span style="background-color:#3F953A"><font color="#000000">Ace Judge</font></span> V3.0 Beta3 <font color="#950095">(Released 01/04 2015) </font>
			<font color="#2F5AF3">by CDQZ_</font><font color="#DE3E35">l</font><font color="#3F953A">a</font><font color="#D2B67C">e</font><font color="#2F5AF3">k</font><font color="#950095">o</font><font color="#3F953A">v</font> 
C - Configure
R - Run
Q - Quit
q
╭─<font color="#3F953A"><b>chaigidel@chaigidel-pc</b></font> <font color="#2F5AF3"><b>/tmp/rec</b></font>  
╰─<font color="#2A2C33"><b>$</b></font> <font color="#3F953A">cat</font> <u style="text-decoration-style:single">w.cfg</u>
%d.in
%d.out
1 10 2000 512
a.cpp
╭─<font color="#3F953A"><b>chaigidel@chaigidel-pc</b></font> <font color="#2F5AF3"><b>/tmp/rec</b></font>  
╰─<font color="#2A2C33"><b>$</b></font> <font color="#3F953A">acejudge</font> -fast <u style="text-decoration-style:single">w.cfg</u>
<font color="#D2B67C">Testing program: </font><font color="#950095">a.cpp</font>
<font color="#3F953A">Compile ok</font>
<font color="#3F953A">Test case 1</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1230</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">65120</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 2</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">266</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">9524</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 3</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">313</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">9392</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 4</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">17</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">9312</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 5</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1450</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">60720</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 6</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1924</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">60372</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 7</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">24</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">9248</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 8</font>	<font color="#D2B67C">Time limit exceeded</font>
<font color="#3F953A">Test case 9</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1487</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">60320</font><font color="#D2B67C"> KB</font>
<font color="#3F953A">Test case 10</font>	<font color="#3F953A">Accepted</font>	<font color="#D2B67C">time: </font><font color="#950095">1507</font><font color="#D2B67C"> MS</font>	<font color="#D2B67C">memory: </font><font color="#950095">60164</font><font color="#D2B67C"> KB</font>
<font color="#2F5AF3">Score ratio: </font><font color="#DE3E35">90.00%</font>
Valid time used: <font color="#950095">8218</font> ms	Max memory used: <font color="#950095">65120</font> KB
<font color="#3F953A">Press any key to continue</font>
</pre>