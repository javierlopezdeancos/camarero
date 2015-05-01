/*globals module, require, console*/
module.exports = function () {

  'use strict';

  var http = require( 'http' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    mime = require( 'mime' ),
    cache = {},
    server,
    httpErrors = {
      404: 'Error 404: resource not found.'
    };

  var sendError = function ( response, errorNumber ) {
    response.writeHead( errorNumber, {
      'Content-Type': 'text/plain'
    } );
    response.write( httpErrors[errorNumber] );
    response.end();
  };

  var sendFile = function ( response, filePath, fileContents ) {
    response.writeHead( 200, {
      'Content-Type': mime.lookup( path.basename( filePath ) )
    } );
    response.end( fileContents );
  };

  var serveStatic = function ( response, cache, absPath ) {
    if ( cache[ absPath ] ) {
      sendFile( response, absPath, cache[ absPath ] );
    } else {
      fs.exists( absPath, function ( exists ) {
        if ( exists ) {
          fs.readFile( absPath, function ( err, data ) {
            if ( err ) {
              sendError( response, 404 );
            } else {
              cache[ absPath ] = data;
              sendFile( response, absPath, data );
            }
          } );
        } else {
          sendError( response, 404 );
        }
      } );
    }
  };

  var listenServer = function () {
    server.listen( 3000, function () {
      console.log( 'Server listening on port 3000.' );
    } );
  };

  var createServer = function ( staticsPath ) {
    server = http.createServer( function ( request, response ) {
      var filePath,
        absPath;
      filePath = '';
      if ( request.url == '/' ) {
        filePath = staticsPath + '/index.html';
      } else {
        filePath = staticsPath + request.url;
      }
      absPath = './' + filePath;
      serveStatic( response, cache, absPath );
    } );
  };

  var start = function ( staticsPath ) {
    createServer( staticsPath );
    listenServer();
  };

  return {
    startIn: start
  };

};