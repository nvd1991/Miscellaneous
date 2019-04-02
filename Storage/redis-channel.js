const net = require('net');
const redis = require('redis');

net.createServer(connection =>{
    let sub, pub;
    sub = redis.createClient();
    pub = redis.createClient();

    sub.on('message', (channel, message) => {
        connection.write(message);
    });
    sub.subscribe('Main chat room');

    connection.on('data', (data) => {
        pub.publish('Main chat room', data);
    })

    connection.on('end', () => {
        sub.unsubscribe();
        sub.end();
        pub.end();
    })
}).listen(9000);