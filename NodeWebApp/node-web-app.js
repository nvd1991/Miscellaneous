const http = require('http');

const toDoList = [];

http.createServer((req, res) => {
    let data = [];
    req.on('data', chunk => {
        data.push(chunk);
    });
    req.on('end', () => {
        const info = data.join('');
        switch(req.method) {
            case 'GET':
                res.write(retrieveToDo(info));
                break;
            case 'POST':
                res.write(insertToDo(info));
                break;
            case 'PUT':
                res.write(updateToDo(info));
                break;
            case 'DELETE':
                res.write(deleteToDo(info));
                break;
            default:
                break;
        }
        res.end();
    });
}).listen(9000);

function retrieveToDo(index){
    if(index == '') return toDoList.join(', ');
    if(typeof toDoList[parseInt(index)] === 'undefined') return 'Not found your item';
    return toDoList[parseInt(index)];
}

function insertToDo(data) {
    return toDoList.push(data) ? 'You\'ve added item successfully' : 'Fail to add item';
}

function updateToDo(data) {
    return 0;
}

function deleteToDo(index) {
    return toDoList.splice(index, 1) !== 0 ? 'You\'ve deleted item successfully' : 'Fail to delete item';
}