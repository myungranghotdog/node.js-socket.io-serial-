const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const io = require('socket.io').listen(5300);
const SerialPort = require('serialport');
const port = new SerialPort('com6', {
  baudRate: 9600
}, false);

let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

io.on('connection', function (socket) {
  console.log('connect');
  var instanceId = socket.id;
  socket.on('msg', function (data) {
    console.log('socket Data : ' + data.comment);
    socket.emit('gMsg', {comment: instanceId + ":" + data.comment+'\n'});
  })

  port.on('data', function(data){
    console.log('arduino Data : ' + data);
    socket.emit('recMsg', ' arduino Data : ' + data + '\n');
  })

});


  //spê°? serial?†µ?‹ ?´?‹¤..
  /*
  sp.emit('1', function(error) {
		if(error) {
			return console.log("Error on write : ", error.message);
		} else {
			console.log("ï¿½Ş¼ï¿½ï¿½ï¿½ï¿½ï¿½ ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ ï¿½Ô·ÂµÇ¾ï¿½ï¿½ï¿½ï¿½Ï´ï¿½.");
		}
  });
  */

