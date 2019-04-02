const redis = require('redis');
let currentId = 1;

const client = redis.createClient();
client.on('error', err => {
    console.log(err);
});

switch (process.argv[2]) {
    case 'add':
        addTask(process.argv[3]);
        break;
}

function addTask(...taskInfo){
    client.set('work' + currentId.toString(), taskInfo[0], () => {
        client.get('work' + currentId.toString(), (err, reply) => {
            console.log(reply);
            client.quit();
        })
    })
}