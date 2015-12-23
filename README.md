## Installation

```sh
git clone https://github.com/maxlath/irc-logger
npm install
```
then edit `config/default.js` to fit your needs

```javascript
  serverName: 'irc.freenode.net',
  port: 6667,
  user: 'chatbot',
  channels: ['#inventaire']
```

## Use
**Option 1** - print logs in the terminal

```sh
node server.js

```
**Option 2** - start the process as a daemon and print logs in a file

You can use a tool like [aeternum](https://github.com/AvianFlu/aeternum) to start the process as a [daemon](https://en.wikipedia.org/wiki/Daemon_%28computing%29) (allowing to close the terminal while the process keeps running) and output the logs in the desired files

```sh
aeternum -o logs.txt -e errors.txt -- node server.js

```
then you can even follow the logs live with this command:

```sh
tail -fn 500 logs.txt errors.txt

```
