const mysql = require('mysql');

switch (process.argv[2]) {
    case 'add':
        addTask(process.argv[3], process.argv[4], process.argv[5]);
        break;
    case 'list':
        listTasks();
        break;
}

function doQuery(queryString, values, callback){
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'timetrackdb'
    });

    connection.connect();
    connection.query(queryString, values, callback);
    connection.end();
}

function addTask(...taskInfo){
    const queryString = 'insert into works(date, hours, description) values(?,?,?)';
    const callback = (err, results, fields) => {
        if(err) console.log(err);
        console.log(results.affectedRows ? 'Success' : 'Fail');
    };
    doQuery(queryString, taskInfo, callback);
}

function listTasks() {
    const queryString = 'select id, date, hours, description from works';
    const callback = (err, results, fields) => {
        if(err) console.log(err);
        for(let result of results){
            console.log(result.id, result.date, result.hours, result.description);
        }
    };
    doQuery(queryString, undefined, callback);
}