/*globals require*/

var server = ( function () {
  'use strict';
  var camarero = new require( './camarero.js' )();
  var initialize = function () {
    camarero.startIn( 'public' );
  };
  return {
    start: initialize
  };
} )();

server.start();