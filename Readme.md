Delegator
=========

> 基于jQuery的事件代理方案

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