var j5 = require("johnny-five");
var http = require('http');

var leds = {};

var myBoard = new j5.Board();

function hide(type, leds) {
    "use strict";
    leds[type].off();
}

function show(type, delay, leds) {
    "use strict";
    try {
        leds[type].on();
        setTimeout(function () {
            hide(type, leds);
        }, delay);
    } catch (error) {
        console.log('no such led');
    }
}

var initLeds = function () {
    "use strict";

    leds.success = new j5.Led(10);
    leds.working = new j5.Led(9);
    leds.failure = new j5.Led(8);
    // try "on", "off", "toggle", "strobe", "stop" (stops strobing)

    leds.success.off();
    leds.working.off();
    leds.failure.off();
};

function mainApp() {
    "use strict";

    initLeds();

    http.createServer(function (req, res) {
        var url = req.url;
        console.log(url);

        switch (url) {
            case '/compilation/success':
                show('success', 1000, leds);
                break;
            case '/compilation/working':
                show('working', 1000, leds);
                break;
            case '/compilation/error':
                show('failure', 1000, leds);
                break;
            default:
                break;
        }

        // send empty response
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=UTF-8'
        });
        res.end('');
    }).listen(9080, "");
}

myBoard.on("ready", mainApp);
