const http = require('http');

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
    getHTML('http://www.english-for-students.com/A-Wise-Counting.html'),
    getHTML('http://www.english-for-students.com/bye-baby-bunting.html'),
    getHTML('http://mathforum.org/library/drmath/view/57301.html'),
]);

//Html get request
function getHTML(link) {
    return function(callback){
        http.get(link, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(data.toString());
                console.log('---------------------------------------------------');
                callback();
            });
        });
    }
}