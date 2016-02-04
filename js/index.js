'use strict';

var GlobalPage = require('./GlobalPage');
var domready = require('detect-dom-ready');

 
domready(function () {
  let globPage = new GlobalPage();
  console.log('init!!');       
});
