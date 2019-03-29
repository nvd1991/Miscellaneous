//Implement series flow control for async calls
function series(tasks) {
    let currentTask = 0;
    if (tasks.length < 1) return;
    for (let task of tasks) {
        if (typeof task !== 'function')
            return;
    }
    callback();

    //Run next task
    function callback() {
        if (currentTask < tasks.length) {
            tasks[currentTask++](callback);
        }
    }
}

//Async functions in an ordered array
series([
    function (callback) {
        setTimeout(function () {
            console.log('1000 ms');
            callback();
        }, 1000);
    },
    function (callback) {
        setTimeout(function () {
            console.log('2000 ms');
            callback();
        }, 1000);
    },
    function (callback) {
        setTimeout(function () {
            console.log('3000 ms');
            callback();
        }, 1000);
    },
]);