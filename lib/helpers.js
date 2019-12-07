const { yellow } = require('tiny-chalk')

let lastLoggedDay = null

const now = () => {
  const [ day, rest ] = new Date().toISOString().split('T')

  if (day !== lastLoggedDay) {
    console.log(yellow(`--------------${day}--------------`))
    lastLoggedDay = day
  }

  return rest.split('.')[0]
}

const logUserMessage = (chan, user_, message) => {
  let messageLogLine = `[${now()}] <${user_}> ${message}`
  if (chan) messageLogLine = `[${chan}]${messageLogLine}`
  console.log(messageLogLine)
}

module.exports = { logUserMessage }
