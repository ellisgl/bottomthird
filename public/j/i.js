const socket = io();
const rightTopLeftContent = document.getElementById('rightTopLeftContent');
const rightBottomLeftContent = document.getElementById('rightBottomLeftContent');
const rightBottomRightContent = document.getElementById('rightBottomRightContent');

let rx;
let tx;

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

(function() {
    socket.on('bandwidth', function(data) {
        if (data.rx[1] > data.rx[0]) {
            rx = formatBytes(data.rx[1] -  data.rx[0], 0);
        } else {
            rx = formatBytes(data.rx[0] -  data.rx[1], 0);
        }

        if (data.rx[1] > data.rx[0]) {
            tx = formatBytes(data.tx[1] -  data.tx[0], 0);
        } else {
            tx = formatBytes(data.tx[0] -  data.tx[1], 0);
        }

        rightTopLeftContent.innerHTML = 'T: ' + tx + '<br>R: ' + rx;
    });

    socket.on('headline', function (headline) {
        rightBottomRightContent.innerHTML = headline;
    });

    socket.on('temp', function(temp) {
        rightBottomLeftContent.innerHTML = temp;
    });
})();
