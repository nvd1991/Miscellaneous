const connect = require('connect');
const url = require('url');
const qs = require('querystring');

const users = {
    someonename: 'somepassword',
}
const app = connect();

app.use(logger);
app.use('/admin', basicAuthentication);
app.use('/admin', restrictAccess);
app.use(sayHello);

app.listen(9000);

function logger(req, res, next) {
    console.log('%s %s',req.method, req.url);
    next();
}

function basicAuthentication(req, res, next) {
    console.log(req.headers.authorization);
    if(!req.headers.authorization){
        res.writeHead(401, 'Unauthorized', {'WWW-Authenticate' : 'Basic realm="User Visible Realm"'});
        res.end();
    } else {
        next();
    }
}

function restrictAccess(req, res, next){
    const auth = req.headers.authorization.split(' ');
    const info = Buffer.from(auth[1], 'base64').toString().split(':');

    if(users.hasOwnProperty(info[0]) && users[info[0]] === info[1]){
        return next();
    } else {
        return next('Unauthorized')
    }
}

function sayHello(req, res){
    res.end('Hello world');
}

