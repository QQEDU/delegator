function Callback(callback) {
    callback = callback || function () {};
    this.proxy = function () {
        callback.apply(this, arguments);
    }
    this.set = function (cb) {
        callback = cb;
    }
}
var sendCallback = new Callback();
new Delegator('#container')
    .on('click', 'send', sendCallback.proxy);

describe('delegator', function () {
    it('should delegate event & send message to handler', function (done) {
        sendCallback.set(function (e, msg) {
            expect(msg).to.equal('hello');
            done();
        });
        document.getElementById('test1').click();
    });

    it('should allow event bubbling', function (done) {
        var i = 0;
        sendCallback.set(function (e, msg) {
            if (!i) {
                expect(msg).to.equal('tecent');
                i++;
            } else {
                expect(msg).to.equal('qq');
                done();
            }
        });
        document.getElementById('test2').click();
    });

    it('should stop event propagation', function (done) {
        var i = 0;
        sendCallback.set(function (e, msg) {
            if (!i) {
                expect(msg).to.equal('qq');
                i++;
                setTimeout(done, 0);
            } else {
                // it should not be call
                expect(false).to.be.a('string');
            }
        });
        document.getElementById('test3').click();
    });
});