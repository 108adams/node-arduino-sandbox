var five = require("johnny-five");
var http = require('http');

var leds = {};

var myBoard = new five.Board();

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
        console.log(error);
    }
}

function initLeds () {
    "use strict";

    leds.success = new five.Led(10);
    leds.working = new five.Led(9);
    leds.failure = new five.Led(8);
    // try "on", "off", "toggle", "strobe", "stop" (stops strobing)

    leds.success.off();
    leds.working.off();
    leds.failure.off();
}

function initButtons () {
    "use strict";

    // Create a new `button` hardware instance.
    // This example allows the button module to
    // create a completely default instance
    var button = new five.Button(7);

    // Inject the `button` hardware into
    // the Repl instance's context;
    // allows direct command line access
//    board.repl.inject({
//        button: button
//    });

    // Button Event API

    // "down" the button is pressed
    button.on("down", function() {
        console.log("down");
    });

    // "hold" the button is pressed for specified time.
    //        defaults to 500ms (1/2 second)
    //        set
    button.on("hold", function() {
        console.log("hold");
    });

    // "up" the button is released
    button.on("up", function() {
        console.log("up");
    });
}

function initPhoto () {
    "use strict";

    var photo = new five.Sensor({
        pin: "A0",
        freq: 250
    });

    // Inject the `sensor` hardware into
    // the Repl instance's context;
    // allows direct command line access
//    board.repl.inject({
//        pot: photo
//    });

    // "data" get the current reading from the potentiometer
    photo.on("data", function() {
        console.log(this.value, this.raw);
    });
}

function mainApp() {
    "use strict";

    initLeds();
    initButtons();
    initPhoto();

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
