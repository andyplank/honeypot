import { Room, Player, Message } from './types';
const { WebSocket } = require('ws');

const uuidv4 = require('uuid').v4;

const rooms:any = {};
const connections:any = {};

const typesDef = {
    create_room: 'create_room',
    join_room: 'join_room',
    start_game: 'start_game',
    submit_answer: 'submit_answer',
    guess: 'guess'
}

// Entry point for a new player
export function newConnection(connection: any) {
    const userId = uuidv4();
    console.log('Recieved a new connection');
    connections[userId] = connection;
    connection.on('message', (message: any) => handleMessage(message, userId));
    connection.on('close', () => handleDisconnect(userId));
}

function handleMessage(message: any, userId: any) {
    const data = JSON.parse(message.toString());
    const msgType = data.type;
    switch (msgType) {
        case typesDef.create_room:
            createRoom(data, userId);
            startGame(data, userId);
            break;
        case typesDef.join_room:
            joinRoom(data, userId);
            break;
        case typesDef.start_game:
            startGame(data, userId);
            break;
        case typesDef.submit_answer:
            submitAnswer(data, userId);
            break;
        case typesDef.guess:
            guess(data, userId);
            break;
        default:
    }
}

function createPlayer(name: string, userId: string){
    const player: Player = {
        name: name,
        id: userId,
        points: 0,
        answer: "",
        canGuess: false,
    }
    return player;
}

function createRoom(data: any, userId: any) {
    const host = createPlayer(data.name, userId);
    const code = data.room_code ? data.room_code : generateRandomString(6);
    if (getRoom(code) !== null) { return }

    const room: Room = {
        roomCode: code,
        hostId: host.id,
        players: [host],
        firstPlayerIndex: 0,
        currQuestion: "",
        remainingAnswers: [],
    }
    rooms[room.roomCode] = room;

    const msg_body = {
        text: `${host.name} has created the room with code ${room.roomCode}`
    }
    const msg = createMessage("new_room", msg_body);
    broadcastMessage(room, msg);
}

function joinRoom(data: any, userId: any) {
    const player = createPlayer(data.name, userId);
    const room = getRoom(data.room_code);
    if (room === null) { return }

    // User is already in the room
    const index = room.players.findIndex((player: Player) => player.id === userId);
    if (index !== -1) { return }

    room.players.push(player);

    const msg_body = {
        text: `${player.name} has joined the room`
    }
    const msg = createMessage("new_player", msg_body);
    broadcastMessage(room, msg);

}

function startGame(data: any, userId: string) {
    const room = getRoom(data.room_code);
    if (room === null) { return }
    if (room.hostId !== userId) {
        return;
    }
    const msg_body = {
        text: `Starting game`
    }
    const msg = createMessage("start_game", msg_body);
    broadcastMessage(room, msg);
    newRound(room.roomCode);
}

function submitAnswer(data: any, userId: string) {
    const answer = data.answer;

    const room = getRoom(data.room_code);
    if (room === null) { return }
    const player = room.players.find((player: Player) => player.id === userId);
    if (player === undefined || player.answer !== "") { return }

    player.answer = answer;
    room.remainingAnswers.push(answer);
    
    const msg_body = {
        text: `${player.name} has submitted an answer`
    }
    const msg = createMessage("new_room", msg_body);
    broadcastMessage(room, msg);
}

function guess(data: any, userId: string) {
    const guessedPlayerName = data.guessed_player;
    const guessedAnswer = data.guessed_answer;

    const room = getRoom(data.room_code);
    if (room === null) { return }

    // Check if guessedAnswer is in remainingAnswers
    if (room.remainingAnswers.includes(guessedAnswer) === false) { return }

    const playerInd = room.players.findIndex((player: Player) => player.id === userId);
    const player = room.players[playerInd];
    if (player === undefined) { return }
    if (player.canGuess === false) { return }

    if (guessedPlayerName === player.name) { return }

    const guessedPlayer = room.players.find((player: Player) => player.name === guessedPlayerName);
    if (guessedPlayer === undefined) { return }

    if (guessedPlayer.answer === guessedAnswer) {
        player.points += 1;
        room.remainingAnswers.splice(room.remainingAnswers.indexOf(guessedAnswer), 1);
    } else {
        player.canGuess = false;
        const nextPlayerInd = (playerInd + 1)%room.players.length;
        room.players[nextPlayerInd].canGuess = true;
    }
}

function newRound (roomCode: string) {
    const room = getRoom(roomCode);
    if (room === null) { return }

    // Reset player answers and canGuess to true
    for (let player of room.players) {
        player.answer = "";
        player.canGuess = false;
    }

    room.players[room.firstPlayerIndex].canGuess = true;

    // TODO: Get questions from file
    const question = "What is the best color?";
    room.currQuestion = question;
    
    const msg_body = {
        question: question
    }
    const msg = createMessage("new_round", msg_body);
    broadcastMessage(room, msg);
}


function generateRandomString(length: number):string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      result += letters[randomIndex];
    }
    return result;
}

function getRoom(code: string): Room | null{
    // TODO: Erorr checking
    if (code in rooms === false) {
        return null;
    }
    return rooms[code];
}

function handleDisconnect(userId: string) {
    delete connections[userId];
    // loop over all the rooms and find any rooms with playerId = userId
    // if found, delete that player from the room
    const roomKeys = Object.keys(rooms);
    roomKeys.forEach((roomKey: string) => {
        const room = rooms[roomKey];
        const index = room.players.findIndex((player: Player) => player.id === userId);
        const player = room.players[index];
        const msg_body = {
            text: `Player ${player.name} has disconnected`
        }

        if (index !== -1) {
            room.players.splice(index, 1);
        }

        
        const msg = createMessage("disconnected", msg_body);
        broadcastMessage(room, msg);
    });    
}

function createMessage(type: string, data: any) {
    const message:Message = {
        type: type,
        ...data
    }
    return message;
}

// Send message to all clients in a room
function broadcastMessage(room: Room, message:Message) {
    const data = JSON.stringify(message);
    for (let player of room.players) {
        const client = connections[player.id];
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    }
}