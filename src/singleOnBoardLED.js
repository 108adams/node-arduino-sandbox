function singleOnBoardLED() {
    var j5 = require("johnny-five");
    var myBoard, myLed;

    myBoard = new j5.Board();

    myBoard.on("ready", function () {

        myLed = new j5.Led(13);

        myLed.strobe(1000);

        // make myLED available as "led" in REPL

        this.repl.inject({
            led: myLed
        });

        // try "on", "off", "toggle", "strobe", "stop" (stops strobing)
    });
}

exports.init = singleOnBoardLED;
