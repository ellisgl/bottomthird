'use strict';
// Load our includes.
const config   = require('../config');
const express  = require('express');
const app      = express();
const http     = require('http').createServer(app);
const io       = require('socket.io')(http);
const node_ssh = require('node-ssh');
const ssh      = new node_ssh();

// Connect to router.
ssh.connect(
    {
        host: process.env.ROUTER_HOST || config.router.host,
        username: process.env.ROUTER_USER || config.router.user,
        password: process.env.ROUTER_PASS || config.router.pass
    })
   .then(function () {
             console.log('Connected to router.');
         }
   )
   .catch((error) => {
       console.error(error);
   });

// Setup Express.JS
app.use(express.static('public'));

// Routes
require('./main').init(app);

// Socket init
require('./sockets').init(app, io, ssh);

module.exports = http;
