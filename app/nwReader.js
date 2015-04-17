window.gui = require('nw.gui');
window.clipboard = window.gui.Clipboard.get();
window.win = window.gui.Window.get();

var inputEvent = require('./inputEvent.js');

var keyState = {
	lastCtrlC: 0,
	ctrlDown: false,
	cDown: false
};

var checkCtrlC = function() {
	if(keyState.ctrlDown && keyState.cDown) {
		console.log("CTRL C");
		var currentTime = new Date().getTime();
		if(currentTime - keyState.lastCtrlC < 500) {
			// this function is defined in the ViewerController
			window.showAndReadFromClipboard();
			keyState.lastCtrlC = 0;
		}
		keyState.lastCtrlC = new Date().getTime();
	}
};

var k = new inputEvent('event3');
k.on('keyup', function(data) {
	if(data.keyId === 'KEY_LEFTCTRL' || data.keyId === 'KEY_RIGHTCTRL') {
		keyState.ctrlDown = false;
	}

	if(data.keyId === 'KEY_C') {
		keyState.cDown = false;
	}
});

k.on('keypress', function(data) {
	if(data.keyId === 'KEY_LEFTCTRL' || data.keyId === 'KEY_RIGHTCTRL') {
		keyState.ctrlDown = true;
	}
	if(data.keyId === 'KEY_C') {
		keyState.cDown = true;
	}
	if(data.keyId == 'KEY_SPACE') {
		window.tryPauseReading();
	}
	checkCtrlC();
});
