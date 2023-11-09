const express = require('express');
const app = express();
const Connection = require('./config/mongoose');
const InfoModel = require('./model/infoSchema');
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

		try {
			const dataToInsert = decryptedMessage.map((message) => ({
				...message
			}));
			console.log(dataToInsert);
			await InfoModel.insertMany(dataToInsert);
		} catch (error) {
			console.log("Error while inserting data",error.message);
		}
		console.log('decryptedMessage', decryptedMessage);
	});
});

app.get('/api/data', async (req, res) => {
	try {
		const data = await InfoModel.find();
		console.log(data);
		res.json(data);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({message:"Internal Server Error"});
	}
});

server.listen(port, console.log(`Server is up at: ${port}`));
