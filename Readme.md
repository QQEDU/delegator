Delegator
=========
[![Build Status](https://travis-ci.org/QQEDU/delegator.svg?branch=master)](https://travis-ci.org/QQEDU/delegator)

> 基于jQuery的事件代理方案

姐妹项目
-------

> https://github.com/QQEDU/delegator2

入门
-----

* html中对事件与方法名绑定，如对于click事件，则对应data-event-click：
```html
<div id="delegator-container">
<p data-event-click="showAlert">点击我会弹出alert</p>
</div>
```

* javascript中对方法名与具体函数绑定，则：
```javascript
(new Delegator('#delegator-container'))
    .on('click', 'showAlert', function () {
        alert('hello world');
    });
```

阻止冒泡
--------

可以利用data-event-stop-propagation阻止冒泡发生，例如：

```html
<div id="delegator-container">
    <div data-event-click="ignore">
        <p data-event-click="showAlert" data-event-stop-propagation="click">点击我会弹出alert</p>
    </div>
</div>
```

通过`data-event-stop-propagation="click"`可以阻止对应事件的冒泡行为，所以ignore对应的方法不会被执行：

```
(new Delegator('#delegator-container'))
    .on('click', 'showAlert', function () {
        alert('hello world');
    }).on('click', 'ignore', function () {
        alert('该方法不会被执行');
    });
```

传入参数
--------

可以将参数传入其中方法，例如：
```html
<div id="delegator-container">
<p data-event-click="showAlert, hello&nbsp;world">点击我弹出hello world</p>
<p data-event-click="showAlert, hello&nbsp;Tecent">点击我弹出hello Tecent</p>
</div>
```

```javascript
(new Delegator('#delegator-container'))
    .on('click', 'showAlert', function (e, msg) {
        alert(msg);
    });
```

多事件路由
---------

可以路由多个自定义事件，以空格分割，例如：

```html
<div id="delegator-container">
<p data-event-click="showAlert, hello&nbsp;world consoleLog, hello&nbsp;Tencent">点击我弹出hello world并在控制台打印hello Tencent</p>
</div>
```

```javascript
(new Delegator('#delegator-container'))
    .on('click', 'showAlert', function (e, msg) {
        alert(msg);
    }).on('click', 'consoleLog', function (e, msg) {
        console.log(msg);
    });
```

性能
----

请参考下面测试用例，基本是jQuery.on事件代理90%的效率，正常情况下，性能瓶颈不应出现在该组件：

> http://jsperf.com/delegator-perf/4

指南
----

简单的讲，是一种在节点上的事件路由机制，例如：

* 我们可以将对A节点的click事件路由成clickA事件
* 我们也可以将对一个Button的click事件路由成showAlert事件

这样可以方便我们将事件语义化，避免class(表征节点表现)与事件耦合。

