const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const options = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'key-cert.pem'))
};

https.createServer(options, function(req, res) {
    if(req.url === '/form-process') {
        const form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            console.log(fields);
            res.end();
        })
    } else {
        sendForm(res);
        res.end();
    }
}).listen(9000);


function logRequestData(req){
    let data = '';
    req.on('data', function(chunk) {
        data += chunk;
    })
    req.on('end', function(err) {
        console.log(data);
    })
}

function sendForm(res){
    res.setHeader('Content-Type', 'text/html');
    res.end("<form action=\"form-process\" method=\"POST\">\n" +
        "    <input type=\"text\" name=\"name\">\n" +
        "    <input type=\"submit\" value=\"submit\">\n" +
        "</form>");
}

// Comment http/https to run the code
// http.createServer((req, res) => {
//     if(req.url === '/form-process') {
//         logRequestData(req);
//     } else {
//         sendForm(res);
//     }
//     res.end();
// }).listen(9000);