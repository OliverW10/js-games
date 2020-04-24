// have to host a local https server for this to work
// python -m http.server
var tonnisLoaded = false;
var tonnisSound = new Pizzicato.Sound({ 
    source: 'file',
    options: {"path": './sounds/tonnis.wav' }
}, function() {
	tonnisLoaded = true;
    console.log('sound file loaded!');
});
