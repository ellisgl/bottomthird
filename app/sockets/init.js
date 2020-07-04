'use strict';

let bandwidth     = {rx: [0, 0], tx: [0, 0]};
let headLineIndex = 0;
let headLines     = [
    'OLD MAN YELLS AT CLOUD',
    'ARE YOU A BART OR A MILHOUSE?',
    'BUMBLEBEE MAN CAUGHT IN STING',
    'Ketchup Truck Hits Hamburger Stand',
    'President, Rock Star To Swap Wives',
    'SPINNING NEWS PAPER INJURES PRINTER',
    'YOU NEED A HEART TO LIVE',
    'Devs sit down at the Stand Up.'
];
let temp          = '0';

function initSocket(app, io, ssh) {
    // Get and transmit router rx/tx of WAN port.
    function getBandWidth() {
        ssh.execCommand('cat /proc/net/dev|grep eth0')
           .then(function (result) {
               if (result.stdout) {
                   let res = result.stdout.replace(/  +/g, ' ').split(' ');
                   // Add to the back of the stack, and remove the 1st item. Also divide by 8 (bits to bytes?)
                   bandwidth.rx.push(res[1] / 8);
                   bandwidth.rx.shift();
                   bandwidth.tx.push(res[9] / 8);
                   bandwidth.tx.shift();

                   io.emit('bandwidth', bandwidth);
               }
           })
           .catch((error) => {
               console.error(error);
           });
    }

    // Transmit and cycle through headlines.
    function getHeadline() {
        io.emit('headline', headLines[headLineIndex]);

        ++headLineIndex;

        if (headLineIndex > (headLines.length - 1)) {
            headLineIndex = 0;
        }
    }

    // Get and transmit the router CPU temperature.
    function getTemp() {
        ssh.execCommand('cat /proc/dmu/temperature')
           .then(function (result) {
               if (result.stdout) {
                   temp = result.stdout.split("\t:")[1].split("�")[0].trim();
                   io.emit('temp', temp + '°');
               }
           })
           .catch((error) => {
               console.error(error);
           });
    }

    // Get and transmit the initial temp. Set to 1 second to allow for SSH to connect.
    setTimeout(function () {
        getTemp();
    }, 1000);

    // Get and transmit bandwidth every 1 second.
    setInterval(function () {
        getBandWidth();
    }, 1000);

    // Get and transmit headline every 10 seconds.
    setInterval(function () {
        getHeadline();
    }, 10000);

    // Get and transmit temp every 1 minute.
    setInterval(function () {
        getTemp();
    }, 60000);

    // Do stuff on websocket connection.
    io.on('connection', (socket) => {
        console.log('user connected');

        // Send the headline and temp.
        io.emit('headline', headLines[headLineIndex]);
        io.emit('temp', temp + '°');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

module.exports = initSocket;
