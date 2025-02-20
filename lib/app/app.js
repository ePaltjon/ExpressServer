const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const expressHandlebars = require('express-handlebars');
const sessionFileStore = require('session-file-store');
const morgan = require('morgan');
const path = require('path');

const secret = require('./secret/secret.js');
const config = require('../config.js');
const logger = require('../logger.js');

const app = express();

app.use(morgan(config.morganFormat, config.projectPath))

const FileStore = sessionFileStore(expressSession);
app.use(expressSession({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false,
    store: new FileStore({
        path: path.join(__dirname, '..', 'sessions')
    }),
}))

app.engine('hbs', expressHandlebars.engine({defaultLayout: null, extname:'.hbs'}));
app.set('views', config.projectPath('views'));

app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());

app.use('/secret', secret.router);

app.post('/reset', (req, res) => {
    req.session.guesses = [];
    targetNumber = Math.floor(Math.random() * 100) + 1;
    req.session.targetNumber = targetNumber;
    req.session.correct_or_not = false;
    return res.status(303).redirect('/secret/play');
});

//allows express to use static files
app.use(express.static(config.staticDir));

//Not found page
app.use( (req, res) => {
    return res.status(404).sendFile(path.resolve(__dirname, '../../static/index.html'));
})

module.exports = app;