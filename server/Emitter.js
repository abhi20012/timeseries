const crypto = require('crypto')
const socketClient = require('socket.io-client')
const { names, cities } = require('./data.json');
const key = 'demoKey';

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomMessage() {
    try {
        const name = getRandomElement(names);
        const city = getRandomElement(cities);

        const originalMessage = {
            name: name,
            city: city,
        };

        const secretKey = crypto.createHash('sha256').update(JSON.stringify(originalMessage)).digest('hex');
        console.log('secretKey : ', key)

        return { ...originalMessage, key };
    }
    catch (error) {
        console.error("error", error.message)
    }

}

function encryptMessage(message, key) {
    try {
        const cipher = crypto.createCipher('aes-256-cbc', key)
        let encryptedMessage = cipher.update(JSON.stringify(message), 'utf8', 'hex');
        encryptedMessage = encryptedMessage + cipher.final('hex')
        console.log('encryptedMessage : ', encryptedMessage)
        return encryptedMessage;
    }
    catch (error) {
        console.error("Error :", error.message)
    }
}

const socket = socketClient('http://localhost:8000')
const Interval = 10000;

setInterval(() => {
    const numberOfMessages = Math.floor(Math.random() * 451) + 49;
    const messages = [];
    for (let i = 0; i < numberOfMessages; i++) {
        const message = generateRandomMessage();
        messages.push(encryptMessage(message, key))
    }
    const dataStream = messages.join('|');
    socket.emit("dataStream", dataStream)
}, Interval);