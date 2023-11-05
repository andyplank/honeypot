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
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle all other routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// app.use(express.static(path.join(__dirname, "./client/build", "index.html")));
// app.use(express.static("public"));

const port = 8000;
server.listen(port, () => {
	console.log(`WebSocket server is running on port ${port}`);
});

// A new client connection request received
wsServer.on('connection', function(connection: any) {
	newConnection(connection);
});