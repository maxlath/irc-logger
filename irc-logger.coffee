net = require 'net'
# force colors even if the environment detection would have disabled it
require('colors').enabled = true

{ serverName, port, user, channels } = require 'config'
singleChannel = channels.length is 1
channels = channels.join ','

# Initial connection
server = net.connect port, serverName, ->
  server.setEncoding 'utf8'
  console.log "Connected to: #{serverName} on port #{port}".cyan

# Send registration on connect
register = ->
  sendMsg "NICK #{user}"
  sendMsg 'USER test 1 * :Hello!'

now = -> (new Date().toISOString()).grey

sendLog = (chan, user_, msg) ->
  logMsg = "[#{now()}] <#{user_}> #{msg}"
  unless singleChannel then logMsg = "[#{chan}]#{logMsg}"
  console.log logMsg

sendMsg = (msg) -> server.write "#{msg}\r\n"

server.on 'connect', register

# Handle server events
server.on 'data', (buf) ->
  message = buf.toString()
  parts = message.split ' '

  if parts[0] is 'PING' then return sendMsg 'PONG ' + parts[1]

  messages = message.split '\r\n'

  for msg in messages
    [ sender, code, chan, rest... ] = msg.split ' '
    sender = sender.match(/\w+/)?.toString()
    # removing the leading ':'
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
          sendLog chan.green, sender.cyan, text
        when 'JOIN'
          sendLog chan.green, sender.green, 'has joined.'.green
          if singleChannel then showPostMsgHelp()
        when 'QUIT'
          sendLog chan.red, sender.red, 'has quit.'.red
        else
          if code[0] is '4' then console.log 'error'.red, message

server.on 'error', (err)-> console.log 'err'.red, err

if singleChannel
  process.stdin.on 'data', (buf)->
    msg = buf.toString()
    server.write "PRIVMSG #{channels} :#{msg}\r\n"
    sendLog null, user.green, msg

showPostMsgHelp = ->
  console.log 'Type your text and press Enter to send a message'.green
