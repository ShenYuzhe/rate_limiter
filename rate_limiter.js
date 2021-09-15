function CounterLimiter(limit_per_second, window_size=100) {
    this.window_size = window_size;
    this.count_per_window = limit_per_second * window_size / 1000;
    this.remain = this.count_per_window
    console.log('in constructor');
    this.StartTimeTick(this);
}

CounterLimiter.prototype.StartTimeTick = function(obj) {
    setTimeout(() => {
        obj.remain = obj.count_per_window;
        obj.StartTimeTick(obj);
    }, obj.window_size);
}

CounterLimiter.prototype.QueryOrReject = function() {
    if (this.remain == 0) {
        return false;
    }
    this.remain--;
    return true;
}

exports.CounterLimiter = CounterLimiter;


function LeakBucketLimiter(limit_per_sec, callback, queue_limit = 100) {
    this.sleep_time = 1000 / limit_per_sec;
    this.callback = callback;
    this.queue = [];
    this.queue_limit = queue_limit;
    this.StartTimeTick(this);
}

LeakBucketLimiter.prototype.StartTimeTick = function(obj) {
    setTimeout(() => {
        e = obj.queue.shift();
        if (e != undefined) {
            obj.callback(e);
        }
        obj.StartTimeTick(obj);
    }, obj.sleep_time);
}

LeakBucketLimiter.prototype.Insert = function(e) {
    if (this.queue.length == this.queue_limit) {
        return new Error('queue is full');
    }
    this.queue.push(e);
}

exports.LeakBucketLimiter = LeakBucketLimiter;


function TokenBucketLimiter(byte_size_per_second, window_size=100) {
    this.window_size = window_size;
    this.new_token = byte_size_per_second * window_size / 1000;
    this.bucket_size = byte_size_per_second;
    this.remain = 0;
    this.StartTimeTick(this);
}

TokenBucketLimiter.prototype.StartTimeTick = function(obj) {
    setTimeout(() => {
        console.log(obj.remain);
        if (obj.remain + obj.new_token > obj.bucket_size) {
            obj.remain = obj.bucket_size;
        } else {
            obj.remain += obj.new_token;
        }
        obj.StartTimeTick(obj);
    }, obj.window_size);
}

TokenBucketLimiter.prototype.QueryOrReject = function(byte_size) {
    if (this.remain < byte_size) {
        return new Error('bucket overflow.');
    }
    this.remain -= byte_size;
}

exports.TokenBucketLimiter = TokenBucketLimiter;
