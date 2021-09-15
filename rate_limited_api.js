var express = require('express');
var rate_limiter = require('./rate_limiter');

var args = process.argv.slice(2);

limit_per_sec = args[0];
window_in_ms = 100;
count = limit_per_sec * window_in_ms / 1000;

var app = express();
var LeakBucketLimiter = rate_limiter.LeakBucketLimiter;

leak_limiter = new LeakBucketLimiter(1, (res) => {
    res.send({'msg': 'successfully served...'});
});
app.get('/', (req, res) => {
    var err = leak_limiter.Insert(res);
    if (err != undefined) {
        res.send({'error': err.message});
    }
});

app.listen(1001, () => {
    console.log(`App listening on port 1001 limit on ${limit_per_sec} requests per second.`);
})