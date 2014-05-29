 (function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        root['Delegator'] = factory(root['$']);
    }

}(this, function ($) {


    function Map() {
        this.map = {};
        this.length = 0;
    }
    Map.prototype = {
        constructor: Map,
        has: function (key) {
            return (key in this.map);
        },
        get: function (key) {
            return this.map[key];
        },
        set: function (key, value) {
            !this.has(key) && this.length++;
            return (this.map[key] = value);
        },
        count: function () {
            return this.length;
        },
        remove: function (key) {
            if (this.has(key)) {
                this.map[key] = null;
                delete this.map[key];
                this.length--;
            }
        }
    };

    function Delegator(container) {
        this.container = $(container);
        this.listenerMap = new Map();
    }

    Delegator.prototype = {
        constructor: Delegator,
        _getListener: function (type) {
            if (this.listenerMap.has(type)) {
                return this.listenerMap.get(type);
            }
            var reg = new RegExp('(^|\\s+)' + type + '(\\s+|$)');
            function listener(e) {
                var self = $(this),
                    that = this,
                    args = self.data('event-' + type),
                    isStop = self.data('event-stop-propagation') && !!reg.test(self.data('event-stop-propagation').replace(/\s/g, '')),
                    handle;
                if (args) {
                    args = args.replace(/\s*,\s*/g, $.expando);
                    args = args.split(' ');

                    $.each(args, function (i, arg) {
                        arg = arg.split($.expando);
                        handle = listener.handleMap.get(arg.shift());

                        if (handle) {
                            arg.unshift(e);
                            handle.apply(that, arg);
                        }
                        isStop && e.stopPropagation();
                    });
                }
            }
            listener.handleMap = new Map();
            this.listenerMap.set(type, listener);
            this.container.on(type, '[data-event-' + type + ']', listener);
            return listener;
        },
        on: function (type, name, handle) {
            var listener = this._getListener(type);
            listener.handleMap.set(name, handle);
            return this;
        },
        off: function (type, name) {
            var listener = this._getListener(type),
                handleMap =  listener.handleMap;
            handleMap.remove(name);
            if (!handleMap.count()) {
                this.container.off(type, '[data-event-' + type + ']', listener);
                this.listenerMap.remove(type);
            }
        }
    };

    return Delegator;
}));
