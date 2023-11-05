import { getRooms, newRoom, submitAnswer } from './util';

const { WebSocketServer } = require('ws');
const http = require('http');

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/new-room', newRoom);
app.post('/submit-answer', submitAnswer);
app.get('/get-rooms', getRooms);

const server:any = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`I'm listening on ${port}`);
});