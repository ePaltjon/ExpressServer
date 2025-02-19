const express = require('express');
const bodyParser = require('body-parser');
//const expressSession = require('express-session');
const expressHandlebars = require('express-handlebars');
//const sessionFileStore = require('session-file-store');
const morgan = require('morgan');

const secret = require('./secret/secret.js');//router for secret feature
const config = require('../config.js');
const logger = require('../logger.js');

const app = express();

app.use(morgan(config.morganFormat, config.projectPath))

/*
const FileStore = sessionFileStore(expressSession);
app.use(expressSession({
    secret: config.sessionSecret,
    saveUnitialized: false,
    resave: false,
    store: new FileStore(),
}))
*/

app.engine('hbs', expressHandlebars.engine({defaultLayout: null, extname:'.hbs'}));
app.set('views', config.projectPath('views'));

app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());

app.use('/secret', secret.router);

//allows express to use static files
app.use(express.static(config.staticDir));

//Not found page
app.use( (req, res) => {
    res.status(404).render('../views/notFound.hbs', { url: req.url });
})

module.exports = app;