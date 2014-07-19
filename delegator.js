 (function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        root['Delegator'] = factory(root['$']);
    }

}(this, function ($) {

    /**
     * Map
     * @class
     */
    function Map() {
        this.map = {};
        this.length = 0;
    }
    Map.prototype = {
        constructor: Map,
        /**
         * has
         * @param {String} key
         * @returns {Boolean}
         */
        has: function (key) {
            return (key in this.map);
        },
        /**
         * get
         * @param {String} key
         * @returns {Any}
         */
        get: function (key) {
            return this.map[key];
        },
        /**
         * set
         * @param {String} key
         * @param {Any} value
         */
        set: function (key, value) {
            !this.has(key) && this.length++;
            return (this.map[key] = value);
        },
        /**
         * count
         * @returns {Number}
         */
        count: function () {
            return this.length;
        },
        /**
         * remove
         * @param {String} key
         */
        remove: function (key) {
            if (this.has(key)) {
                this.map[key] = null;
                delete this.map[key];
                this.length--;
            }
        }
    };

    /**
     * Delegator
     * @class
     * @param {Selector} container
     */
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
                    args = self.data('event-' + type + 'args'),
                    isStop, handle;
                !args &&
                    (args = self.data('event-' + type)) &&
                        (args = args.replace(/\s*,\s*/g, $.expando)) &&
                            (args = args.split(' ')) &&
                                $.each(args, function (i, arg) {
                                        arg = arg.split($.expando);
                                        arg = [arg[0], arg];
                                        args[i] = arg;
                                    }) &&
                                        self.data('event-' + type + 'args', args);
                if (args) {
                    $.each(args, function (i, arg) {
                        handle = listener.handleMap.get(arg[0]);

                        if (handle) {
                            arg[1][0] = e;
                            handle.apply(that, arg[1]);
                        }
                        self.data('event-stop-propagation') &&
                            !!reg.test(self.data('event-stop-propagation')) &&
                                e.stopPropagation();
                    });
                }
            }
            listener.handleMap = new Map();
            this.listenerMap.set(type, listener);
            this.container.on(type, '[data-event-' + type + ']', listener);
            return listener;
        },
        /**
         * on
         * @param {String} type
         * @param {String} name
         * @param {Function} handle
         */
        on: function (type, name, handle) {
            var listener = this._getListener(type);
            listener.handleMap.set(name, handle);
            return this;
        },
        /**
         * off
         * @param {String} type
         * @param {String} name
         */
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
