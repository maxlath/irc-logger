net = require 'net'
# force colors even if the environment detection would have disabled it
require('colors').enabled = true
{ serverName, port, user, channels } = require 'config'
singleChannel = channels.length is 1
channels = channels.join ','

# Initial connection
server = net.connect port, serverName, ->
  server.setEncoding 'utf8'
  welcome = 'Connected to: ' + serverName + ' on port ' + port
  console.log welcome.cyan

# Send registration on connect
register = ->
  sendMsg 'NICK ' + user
  sendMsg 'USER test 1 * :Hello!'

now = -> (new Date().toISOString()).grey

sendLog = (chan, user, msg) ->
  logMsg = "[#{now()}] <#{user}> #{msg}"
  unless singleChannel then logMsg = "[#{chan}]#{logMsg}"
  console.log logMsg

sendMsg = (msg) -> server.write "#{msg}\r\n"

server.on 'connect', register

# Handle server events
server.on 'data', (data) ->
  message = data.toString()
  parts = message.split ' '

  if parts[0] is 'PING' then return sendMsg 'PONG ' + parts[1]

  messages = message.split '\r\n'

  for msg in messages
    [ user, code, chan, rest... ] = msg.split ' '
    user = user.match(/\w+/)?.toString()
    # removing the heading ':'
    text = rest.join(' ').slice 1

    if code?
      switch code
        # Nickname already in use
        when '433'
          user += '_'
          register()
        # End of MOTD
        when '376'
          server.write "JOIN #{channels} \r\n"
        # Message
        when 'PRIVMSG'
          sendLog chan.green, user.cyan, text
        when 'JOIN'
          sendLog chan.green, user.green, 'has joined.'.green
        when 'QUIT'
          sendLog chan.red, user.red, 'has quit.'.red
