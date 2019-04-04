const connect = require('connect');
const url = require('url');
const qs = require('querystring');

// set environment
process.env.NODE_ENV = 'production';
// users' data
const users = {
    someonename: 'somepassword',
}
// routes configuration
const route = {
    '/users/:id': function(req, res, next, id){
        res.end(id[1]);
    },
    '/houses/:id/delete/:room': function(req, res, next, params){
        console.log(params);
        res.end('You\'ve deleted room #' + params[2] + ' of house #' + params[1]);
    }
}

// api application mounted at /api
const api = connect();
api.use('/pets' ,pets);
api.use(reportPetError());

function pets(req, res, next){
    if(req.url !== '/showerr'){
        res.end('Here and ' + req.url);
    } else {
        next(new Error('can not find pets'));
    }
}

// Custom error handler for api
function reportPetError(){
    const env = process.env.NODE_ENV || 'development';
    return function(err, req, res, next) {
        if(err){
            res.statusCode = 500;
            res.statusMessage = 'Internal server error';
            switch (env) {
                case 'development':
                    res.end('API error ' + err.toString());
                    break;
                default:
                    res.end('API error');
                    break;
            }
            return;
        }
        next();
    }
}

// Application at root /
const app = connect();

app.use(logger('Method is: :method - Url is: :url'));
app.use('/admin', basicAuthentication);
app.use('/admin', restrictAccess);
app.use(router(route));
app.use(rewrite);
app.use('/api', api);
app.use(reportError());
app.use(sayHello);

app.listen(9000);

// Configurable logger
function logger(formatString) {
    const pattern = /:(\w+)/g;
    return function(req, res, next) {
        const log = formatString.replace(pattern, (match, property) => {
            return req[property];
        })
        console.log(log);
        next();
    }
}

// Configurable router
function router(route){
    const patterns = {};
    for(let key in route){
        // convert routes into regex patterns
        let pattern = '^' + key.replace(/:(\w+)/g, () => {
            return '(\\w+)';
        }) + '$';
        // saves those patterns into obj {route: pattern}
        patterns[key] = new RegExp(pattern, 'g');
    }

    // return listener
    return function(req, res, next) {
        // Loop through patterns and try to match url
        for(let key in patterns){
            if(req.url.match(patterns[key])){
                // if matched then call appropriate callback with array of extracted params
                route[key].call(null, req, res, next, patterns[key].exec(req.url));
                return;
            }
        }
        // else go to the next listener
        next();
    }
}

// Ask for basic authentication
function basicAuthentication(req, res, next) {
    console.log(req.headers.authorization);
    if(!req.headers.authorization){
        res.writeHead(401, 'Unauthorized', {'WWW-Authenticate' : 'Basic realm="User Visible Realm"'});
        res.end();
    } else {
        next();
    }
}

// Check access right
function restrictAccess(req, res, next){
    const auth = req.headers.authorization.split(' ');
    const info = Buffer.from(auth[1], 'base64').toString().split(':');

    if(users.hasOwnProperty(info[0]) && users[info[0]] === info[1]){
        return next();
    } else {
        return next('Unauthorized')
    }
}

// Simple url rewrite
function rewrite(req, res, next){
    if(req.url === '/'){
        req.url = req.url + 'index.html';
    }
    if(req.url !== '/showerr'){
        return next();
    } else {
        return next(new Error('A random error'));
    }

}

// Custom error handler
function reportError(){
    const env = process.env.NODE_ENV || 'development';
    return function(err, req, res, next) {
        if(err){
            res.statusCode = 500;
            res.statusMessage = 'Internal server error';
            switch (env) {
                case 'development':
                    res.end(err.toString());
                    break;
                default:
                    res.end('Server error');
                    break;
            }
            return;
        }
        next();
    }
}

// Normal greeting
function sayHello(req, res){
    res.end('Hello world, you are accessing ' + req.url);
}

