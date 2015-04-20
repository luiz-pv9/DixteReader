Dixte Reader
============

Open-source implementation of the Spritz speed reading method. 

## Running the software

Just execute the reader.sh script.

```
$ cd DixteReader && ./reader.sh
```

> In order to run it, you must have node-webkit executable (nw) in your path.

If you run with root privileges, system-wide hotkeys will be enabled to provide
a better interface. Those hotkeys are:

* Ctrl-C Ctrl-C (twice) - Brings the reader window to focus and starts the reading loop. This is how I usually use it: leave the window minimized and whenever I found something I want to read, I highlight the text and press Ctrl-C twice to speed read it. This shortcut works across all applications.
* Space - Play/Pause the reader.
