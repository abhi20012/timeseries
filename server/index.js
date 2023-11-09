const express = require('express');
const app = express();
const Connection = require('./config/mongoose');
//secure key put it into .env at production
const key = "demoKey";

const port = process.env.port || 8000;

const http = require('http');
const crypto = require('crypto');

const socket = require('socket.io');

app.use(express.json());

const server = http.createServer(app); //http server using express
const io = socket(server); //socket.io server


//function to decrypt the given text with key
function decryptText(encyptText, key){
	const decipher = crypto.createDecipher('aes-256-cbc', key);
	let decryptedText = decipher.update(encyptText, 'hex', 'utf8');
	decryptedText += decipher.final('utf8');
	return JSON.parse(decryptedText);
}

//creating io connection for emitter 
io.on('connection', (socket) => {
	socket.on('dataStream', async (dataStream) => {
		const encryptedMessage = dataStream.split('|');
		const decryptedMessage = encryptedMessage.map((encryptedMessage) => {
			return decryptText(encryptedMessage, key);
		});

		const date = new Date();

		try {
			const dataToInsert = decryptedMessage.map((message) => ({
				...message, 
				timestamp: date
			}));
			
		} catch (error) {
			
		}
	})
})

server.listen(port, console.log(`Server is up at: ${port}`));
