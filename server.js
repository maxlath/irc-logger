// requires
var net = require('net');
var colors = require('colors');
var fs = require('fs');

///////////////////
// CONFIGURATION //
///////////////////
// irc server to connect to
var serverName = 'irc.snoonet.org';

// port of irc server (default: 6667)
var port = 6667;

// nickname of the bot
var user = 'zobo';

// comma separated channels
var channels = '#reddit,#reddit-live';

// name of log file
var logFile = 'log.txt';
///////////////////
//   STOP HERE   //
///////////////////

// Initial connection
var server = net.connect(port, serverName, function() {
  server.setEncoding('utf8');
  var welcome = 'Connected to: ' + serverName + ' on port ' + port;
  console.log(welcome.cyan);
});

// Send registration on connect
server.on('connect', function() {
  register();
});

// Handle server events
server.on('data', function(data) {
  var message = data.toString();

  if (message.split(' ')[0] === 'PING') {
    sendMsg('PONG ' + message.split(' ')[1]);
  }

  var messages = message.split('\r\n');

  for (msg in messages) {
    var code = messages[msg].split(' ')[1];
    var _user = messages[msg].split(' ')[0].match(/\w+/);
    var _msg = messages[msg].split(' ').slice(3).join(' ').slice(1);
    var _chan = messages[msg].split(' ')[2];

    if (typeof(code) != 'undefined' && message.split(' ')[0] !== 'PING') {
      switch (code) {
        case '433': // Nickname already in use
          user += '_';
          register();
          break;

        case '376': // End of MOTD
          server.write('JOIN ' + channels + '\r\n');
          break;

        case 'PRIVMSG': // Message
          sendLog(_chan.green, _user.toString().cyan, _msg);
          break;

        case 'JOIN':
          sendLog(_chan.green, _user.toString().green, 'has joined.'.green);
          break;

        case 'QUIT':
          sendLog(_chan.red, _user.toString().red, 'has quit.'.red);
          break;

        default:
          break;
      }
    }
  }
});

function register() {
  sendMsg('NICK ' + user);
  sendMsg('USER test 1 * :Hello!');
}

function sendLog(chan, user, msg) {
  var logMsg = '[' + chan + '] <' + user + '> ' + msg;

  console.log(logMsg);
  fs.appendFile(logFile, logMsg + '\r\n', function(err) {
    if (err) throw err;
  });

}

function sendMsg(msg) {
  server.write(msg + '\r\n');
}
