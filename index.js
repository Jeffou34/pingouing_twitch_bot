const { exec } = require('child_process');
var tmi = require('tmi.js');
const hostname = '127.0.0.1';
const port = 1337;
var http = require('http'),
    filePath = 'troubadour.mp3',
const server = http.createServer(function (request, response) {
	response.statusCode = 200;
	response.setHeader('Content-Type', 'text/plain');
	response.end('Hello World');
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

const client = new tmi.Client({
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: 'BanquiseBot',
		password: 'oauth:2m6yxpr33wq4pidr6ehoxf5737a0ra'
	},
	channels: [ 'pingouiing' ]
});

client.connect().catch(console.error);
client.on('connected', (address, port) => {
    client.action('pingouiing', 'BanquiseBot est en ligne !');
})

client.on('chat', (channel, user, message, self) => {
	if (message === '!toto') {
		exec(`mplayer ${filePath}`, (error, stdout, stderr) => {
			if (error) {
			  console.error(`exec error: ${error}`);
			  return;
			}
			console.log(`stdout: ${stdout}`);
			console.error(`stderr: ${stderr}`);
		});
	}
})