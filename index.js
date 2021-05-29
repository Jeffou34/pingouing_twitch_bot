var tmi = require('tmi.js');
var http = require('http'),
	fs = require('fs'),
	extension = '.mp3',
	testFolder = 'audio';
const { execSync } = require('child_process');
server = http.createServer(function (request, response) {
	response.statusCode = 200;
	response.setHeader('Content-Type', 'text/plain');
	response.end('BanquiseBot is listen your channel !');
}).listen(process.env.PORT || 3000)

let commandsFileObject = fs.readdirSync(testFolder).map(value => {
	if (value.includes(extension)) {
		const valueWithoutExtention = value.split('.')[0];
		return {
			fileName: value,
			command: `!${valueWithoutExtention}`,
		};
	}
});
commandsFileObject = commandsFileObject.filter(value => value !== undefined);

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

var active = true;
var ms = 1000;
var cooldown = 120*ms;
var start = null;
var end = null;
client.on('chat', (channel, user, message, self) => {
	let filename = '';
	if (commandsFileObject.some(item => {
		if (item.command === message) {
			filename = item.fileName;
			return true;
		}
		return false;
	})) {
		if (active) {
			execSync(`mplayer ${testFolder}/${filename}`);
			active = false;
			start = Date.now();
			end = Date.now() + cooldown;
			setTimeout(() => {active = true;}, cooldown)
		} else {
			let timeRemaining = end - Date.now();
			client.say('pingouiing', `Commande disponible dans ${Math.floor(timeRemaining / 1000)} secondes`);
		}
	}
})
