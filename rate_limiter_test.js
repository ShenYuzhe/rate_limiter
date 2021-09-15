var rate_limiter = require('./rate_limiter');
var CounterLimiter = rate_limiter.CounterLimiter;

counter_limiter = new CounterLimiter(100);

function testCount() {
    setTimeout(() => {
        if (!counter_limiter.QueryOrReject()) {
            console.log('fucn');
        } else {
            console.log('haha');
        }
        testCount();
    }, 5);
}

var LeakBucketLimiter = rate_limiter.LeakBucketLimiter;
leak_limiter = new LeakBucketLimiter(1, console.log);
function testLeak() {
    setTimeout(() => {
        err = leak_limiter.Insert('test');
        if (err != undefined) {
            console.log(err);
        }
        testLeak();
    }, 50);
}

var TokenBucketLimiter = rate_limiter.TokenBucketLimiter;
token_limiter = new TokenBucketLimiter(100);
function testToken() {
    setTimeout(() => {
        msg = {'jack': 'dog'};
        byte_size = new TextEncoder().encode(msg).length
        err = token_limiter.QueryOrReject(byte_size);
        if (err != undefined) {
            //console.log(err.message);
        } else {
            console.log('succeeded');
        }
        testToken();
    }, 50);
}
testToken();