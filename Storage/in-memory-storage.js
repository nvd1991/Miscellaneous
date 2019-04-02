const http = require('http');
let counter = 0;

http.createServer((req, res) => {
    if(req.url === '/') counter++;
    res.end(counter.toString(10));
}).listen(9000);