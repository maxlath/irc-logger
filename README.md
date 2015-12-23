## installation

```sh
git clone https://github.com/maxlath/irc-logger
npm install
```
then edit `./config/default.js` to fit your needs

## use
* print logs in the terminal
```sh
npm start

```
* start the process as a daemon and print logs in a file
I use [aeternum](https://github.com/AvianFlu/aeternum) to start the process as a [daemon](https://en.wikipedia.org/wiki/Daemon_%28computing%29) (allowing to close the terminal while the process keeps running)

```sh
aeternum -o logs.txt -e errors.txt -- node server.js

```