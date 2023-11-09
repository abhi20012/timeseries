const express = require('express');
const app = express();

//secure key put it into .env at production
const key = "demoKey";

const port = process.env.port || 8000;

const http = require('http');
const crypto = require('crypto');

const socket = require('socket.io');

app.use(express.json());

const server = http.createServer(app); //http server using express
const io = socket(server); //socket.io server


server.listen(port, console.log(`Server is up at: ${port}`));
