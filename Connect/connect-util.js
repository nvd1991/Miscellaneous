const connnect = require('connect');
const fs = require('fs');
const path = require('path');
// Parse cookie middleware
const cookieParser = require('cookie-parser');
// Parse body middleware (for multipart must use formidable)
const bodyParser = require('body-parser');
// Parse get query string
const qs = require('qs');
const url = require('url');
// Logger
const morgan = require('morgan');
// Serve favicon
const serveFavicon = require('serve-favicon');
// Method override
const methodOverride = require('method-override');
// route vhost
const vhost = require('vhost');
// session
const session = require('express-session');
// save session to redis db
const redisStore = require('connect-redis')(session);
// csrf
const csurf = require('csurf');
// error handler
const errorHandler = require('errorhandler');
// compress response
const compression = require('compression');

// setup environment
process.env.NODE_ENV = 'development';
let id = 0;
// output stream for logger
const logOutputStream = fs.createWriteStream('././log.txt', {flags: 'a'});
// csrf middleware
const csrfProtection = csurf();
// static files serving
const serveStatic = require('serve-static');
// serve directory
const serveIndex = require('serve-index');

// sub app to vhost
const mailapp = connnect();
mailapp.use(function (req, res, next) {
    res.end('Hello from mail app');
})

const app = connnect();

// custom token for logger
morgan.token('id', function (req) {
    return req.id;
});

app.use(compression());
app.use(vhost('myframe.fr', mailapp));
app.use(serveFavicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(assignId);
app.use(morgan(':id :method :url - :response-time ms', {stream: logOutputStream}));
app.use(cookieParser('keyboard cat'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new redisStore(),
    name: 'connect.sid.customname',
    cookie: {
        maxAge: 24*60*60*1000,
    }
}));
app.use(parseQueryString)
app.use('/static', serveIndex('public', {icons: true}));
app.use('/static', serveStatic('public'));
app.use(bodyParser.json({limit: '30kb'}));
app.use(bodyParser.text({limit: '100kb'}));
app.use(bodyParser.urlencoded({extended:true}));
// after bodyParser cuz it need POST method to parse
app.use(methodOverride('_method'));
app.use(csrfProtection);
app.use(sayHello);
if(process.env.NODE_ENV === 'development'){
    app.use(errorHandler());
}
app.listen(9000);

// Assign id to request
function assignId(req, res, next){
    req.id = id++;
    next();
}

// parse get query string
function parseQueryString(req, res, next){
    req.query = qs.parse(url.parse(req.url).query);
    next();
}

// Normal greeting
function sayHello(req, res){
    // Set regular cookie
    if(Object.keys(req.cookies).length === 0){
        res.setHeader('Set-Cookie', 'sessionid=j:{"age":"23"}');
    }
    // Set session
    if(!req.session.views){
        req.session.views = 0;
    }
    req.session.views++;
    // log cookie
    console.log('***************************');
    console.log('req.headers.hosts: ', req.headers.host);
    console.log('req.method: ', req.method);
    console.log('req.originalMethod: ', req.originalMethod);
    console.log('req.cookies: ', req.cookies);
    console.log('req.session: ', req.session);
    console.log('req.query: ', req.query);
    console.log('req.body: ', req.body);
    console.log('***************************');
    res.write('<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <title>Title</title>\n' +
        '</head>\n' +
        '<body>\n' +
        '<form action="form-process?_method=DELETE" method="POST">\n' +
        '    <input type="text" name="id">\n' +
        '    <input type="submit" value="submit">\n' +
        '    <input type="hidden" name="_csrf" value="' + req.csrfToken() + '">\n' +
        '</form>\n' +
        '</body>\n' +
        '</html>');
    res.end('Hello world, you are accessing ' + req.url);
}