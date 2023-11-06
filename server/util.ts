import { Room, Player, Message } from './types';
import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

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
        roundNumber: -1,
        guessing: false,
    }
    rooms[room.roomCode] = room;

    const msg_body = {
        text: `${host.name} has created the room with code ${room.roomCode}`
    }
    const msg = createMessage("new_room", msg_body);
    broadcastMessage(room, msg);
}

function joinRoom(data: any, userId: any) {
    if (data.name === undefined || data.room_code === undefined) { return }
    const player = createPlayer(data.name, userId);
    const room = getRoom(data.room_code);
    if (room === null || room.roundNumber !== -1) { return }

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
    room.roundNumber = 0;
    for (let player of room.players) {
        player.points = 0;
    }
    const msg_body = {
        text: `Starting game`,
        round: room.roundNumber
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
    if (player === undefined || player.answer !== "" || room.guessing || room.roundNumber === -1) { return }

    player.answer = answer;
    room.remainingAnswers.push(answer);

    // filter room.players to players which have an answer != ""
    const playersWithAnswers = room.players.filter((player: Player) => player.answer !== "").map((player: Player) => player.name);
    // map to only return the player name
    

    const msg_body = {
        text: `${player.name} has submitted an answer`,
        submitted: playersWithAnswers
    }
    const msg = createMessage("new_room", msg_body);
    broadcastMessage(room, msg);

    if (room.remainingAnswers.length === room.players.length) {
        moveToGuess(room);
    }
}

function moveToGuess(room: Room) {
    room.guessing = true;
    const msg_body = {
        text: `Moving to guess`,
        answers: room.remainingAnswers
    }
    const msg = createMessage("move_to_guess", msg_body);
    broadcastMessage(room, msg);
    const player = room.players[room.firstPlayerIndex];
    if (player === undefined) { return }
    player.canGuess = true;
    setPlayerTurn(room, player);
}

function setPlayerTurn(room: Room, player: Player) {
    if (player === undefined || !player.canGuess) { return }

    const msg_body = {
        text: `Player ${player.name} can guess`,
        currentPlayer: player.name
    }
    const msg = createMessage("set_player_turn", msg_body);
    broadcastMessage(room, msg);
}


function guess(data: any, userId: string) {
    const guessedPlayerName = data.guessed_player;
    const guessedAnswer = data.guessed_answer;

    const room = getRoom(data.room_code);
    if (room === null || room.roundNumber === -1 || !room.guessing) { return }

    // Check if guessedAnswer is in remainingAnswers
    if (room.remainingAnswers.includes(guessedAnswer) === false) { return }

    const playerInd = room.players.findIndex((player: Player) => player.id === userId);
    const player = room.players[playerInd];
    if (player === undefined || !player.canGuess || guessedPlayerName === player.name) { return }

    const guessedPlayer = room.players.find((player: Player) => player.name === guessedPlayerName);
    if (guessedPlayer === undefined) { return }

    if (guessedPlayer.answer === guessedAnswer) {
        player.points += 1;
        room.remainingAnswers.splice(room.remainingAnswers.indexOf(guessedAnswer), 1);

        const msg_body = {
            text: `Correct guess! ${player.name} gets a point!`,
            answers: room.remainingAnswers,
            currentPlayer: player.name,
            points: getPlayerPoints(room)   
        }
        const msg = createMessage("answers", msg_body);
        broadcastMessage(room, msg);

        if (room.remainingAnswers.length === 1) {
            player.points += 1;
            newRound(room.roomCode);
        }
    } else {
        player.canGuess = false;
        const nextPlayerInd = (playerInd + 1)%room.players.length;
        const nextPlayer = room.players[nextPlayerInd];
        if (nextPlayer === undefined) { return }
        nextPlayer.canGuess = true;
        setPlayerTurn(room, nextPlayer);
    }
}

function getPlayerPoints(room: Room) {
    const points:any = {};
    for (let player of room.players) {
        points[player.name] = player.points;
    }
    return points;
}

function newRound (roomCode: string) {
    const room = getRoom(roomCode);
    if (room === null) { return }
    room.guessing = false;
    room.remainingAnswers = [];

    // Reset player answers and canGuess to true
    for (let player of room.players) {
        player.answer = "";
        player.canGuess = false;
    }

    room.firstPlayerIndex = (room.firstPlayerIndex + 1)%room.players.length;
    room.players[room.firstPlayerIndex].canGuess = true;

    room.roundNumber += 1;
    if (room.roundNumber > room.players.length) {
        room.roundNumber = -1;
        const msg_body = {
            text: `Game over!`,
            points: getPlayerPoints(room)
        }
        const msg = createMessage("end_game", msg_body);
        broadcastMessage(room, msg);
        return
    }

    // TODO: Get questions from file
    const question = "What is the best color?";
    room.currQuestion = question;
    
    const msg_body = {
        round: room.roundNumber,
        question: question,
        points: getPlayerPoints(room)   
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
    if (roomKeys === undefined) { return }
    roomKeys.forEach((roomKey: string) => {
        const room = rooms[roomKey];
        const index = room.players.findIndex((player: Player) => player.id === userId);
        if (index === -1) { return }
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
    const roomCode = room.roomCode;
    message.room_code = roomCode;
    message.round = room.roundNumber;
    message.guessing = room.guessing;
    message.points = getPlayerPoints(room);
    message.players = room.players.map((player: Player) => player.name);
    const data = JSON.stringify(message);
    for (let player of room.players) {
        const client = connections[player.id];
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    }
}