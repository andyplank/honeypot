import { newConnection } from "./util";
import express from 'express';
import path from "path";
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();

const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, "./public")));
app.get('/', (req:any, res:any) => {
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const port = process.env.PORT || 80;
server.listen(port, () => {
	console.log(`WebSocket server is running on port ${port}`);
});

wsServer.on('connection', function(connection: any) {
	newConnection(connection);
});