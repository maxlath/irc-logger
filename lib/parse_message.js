const { green, red, cyan, grey } = require('tiny-chalk')
const { logUserMessage } = require('./helpers')

module.exports = ({ user, singleChannel, sendMessage, register, channels }) => message => {
  let [ sender, code, chan, ...rest ] = message.split(' ')
  const senderMatch = sender.match(/\w+/)
  sender = senderMatch && senderMatch.toString()
  // removing the leading ':'
  const messageBody = rest.join(' ').slice(1)
  if (code == null) return
  // Nickname already in use
  if (code === '433') {
    user += '_'
    register()
  } else if (code === '376') {
    // End of MOTD
    sendMessage(`JOIN ${channels} `)
  } else if (code === 'PRIVMSG') {
    // Message
    logUserMessage(green(chan), cyan(sender), messageBody)
  } else if (code === 'JOIN') {
    logUserMessage(grey(chan), grey(sender), grey('has joined.'))
    if (singleChannel) showPostMsgHelp()
  } else if (code === 'QUIT') {
    logUserMessage(grey(chan), grey(sender), grey('has quit.'))
  } else if (code[0] === '4') {
    console.log(red('error'), message)
  }
}

const showPostMsgHelp = () => {
  console.log(green('Type your text and press Enter to send a message'))
}
