// http client
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 9000,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain'
    }
}
const req = http.request(options);

req.write('[');
let n = 300000;
while(n--){
    req.write('"foo",');
}
req.write('"bar"]');
req.end();
console.log('finished');