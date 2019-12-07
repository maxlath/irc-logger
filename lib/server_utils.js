module.exports = (server, user) => {
  const sendMessage = message => server.write(`${message}\r\n`)

  // Send registration on connect
  const register = () => {
    sendMessage(`NICK ${user}`)
    sendMessage('USER test 1 * :Hello!')
  }

  return { sendMessage, register }
}
