import derby from 'derby';
import express from 'express';
import http from 'http';
// used to bundle client side code for browser
import bundle from 'racer-bundle';
// used to setup websocket connections
import highway from 'racer-highway';

// separate the file for client side code
// when app.ts was included here racer-bundle tries bundling
// server code, including node built-ins for the browser
import app from './app';

// derby to use bundler
derby.use(bundle);
const backend = derby.createBackend();

// wrap backend and get upgrade handlers for websocket
const handlers = highway(backend);

function setup(app, options, cb) {
  const expressApp = express(options);

  var publicDir = __dirname + '/public';
  expressApp.use(express.static(publicDir));
  expressApp.use(backend.modelMiddleware());
  expressApp.use(app.router());

  const upgradeCallback = handlers.upgrade;
  console.log('file', backend.filename);
  app.writeScripts(backend, publicDir, { extensions: ['.js'] }, function(err) {
    cb(err, expressApp, upgradeCallback);
  });
}

function run(app, options, cb) {
  options || (options = {});
  var port = options.port || process.env.PORT || 3000;

  function listenCallback() {
    console.log('%d listening. Go to: http://localhost:%d/', process.pid, port);
    cb?.();
  }

  function createServer() {
    setup(app, options, function(err, expressApp, upgrade) {
      if (err) {
        console.error(err);
        process.exit(3);
      }
      var server = http.createServer(expressApp);
      server.on('upgrade', upgrade);
      server.listen(port, listenCallback);
    });
  }

  derby.run(createServer);
}

run(app, { port: 4001 }, () => {});
