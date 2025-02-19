const path = require('path');

const projectDir = path.join(__dirname, '..');

function projectPath(...localPaths) {
    return path.join(projectDir, ...localPaths);
}

module.exports = {
    projectDir,
    projectPath,
    httpPort: 8000,
    staticDir: projectPath('static'),
    logLevel: process.env.LOG_LEVEL?.toLowerCase() || 'debug',
    sessionSecret: process.env.SESSION_SECRET || 'bunnyslippers',
    morganFormat: 'dev',
}