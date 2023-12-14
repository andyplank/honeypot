import { newConnection } from "./util";
import express from 'express';
import path from "path";

const app = express();

import { WebSocketServer } from 'ws';
import http from 'http';

// Spinning the http server and the WebSocket server.
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

// Serve the React app
// app.use(express.static(path.join(__dirname, './client/build')));

// // Handle all other routes
// app.get('/', (req, res) => {
// 	res.send('Hello World!');
// });

// app.use(express.static(path.join(__dirname, "./build/build", "index.html")));
app.use(express.static(path.join(__dirname, "./public")));
// app.use(express.static("./build/build"));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const port = process.env.PORT || 80;
server.listen(port, () => {
	console.log(`WebSocket server is running on port ${port}`);
});

// A new client connection request received
wsServer.on('connection', function(connection: any) {
	newConnection(connection);
});