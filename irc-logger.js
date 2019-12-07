const net = require('net')
const { red, cyan, green } = require('tiny-chalk')

let { serverName, port, user, channels } = require('config')
const singleChannel = channels.length === 1
channels = channels.join(',')

// Initial connection
const server = net.connect(port, serverName, () => {
  server.setEncoding('utf8')
  console.log(cyan(`Connected to: ${serverName} on port ${port}`))
})

const { register, sendMessage } = require('./lib/server_utils')(server, user)
const parseMessage = require('./lib/parse_message')({
  user,
  singleChannel,
  sendMessage,
  register,
  channels
})
const { logUserMessage } = require('./lib/helpers')

server.on('connect', register)

// Handle server events
server.on('data', buf => {
  const text = buf.toString()
  const parts = text.split(' ')

  if (parts[0] === 'PING') return sendMessage('PONG ' + parts[1])

  text
  .split('\r\n')
  .forEach(parseMessage)
})

server.on('error', err => console.log(red('err'), err))

if (singleChannel) {
  process.stdin.on('data', buf => {
    const msg = buf.toString()
    sendMessage(`PRIVMSG ${channels} :${msg}`)
    logUserMessage(null, green(user), msg)
  })
}
