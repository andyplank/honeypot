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
    guess: 'guess',
    select_icon: 'select_icon',
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
    // check if data.room_code exists and is a string
    if (data.room_code !== undefined || typeof data.room_code === "string") { 
        data.room_code = data.room_code.toLowerCase();
    }
    switch (msgType) {
        case typesDef.create_room:
            createRoom(data, userId);
            startGame(data, userId);
            break;
        case typesDef.join_room:
            joinRoom(data, userId);
            break;
        case typesDef.select_icon:
            selectIcon(data, userId);
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

function createPlayer(name: string, userId: string, icon: string){
    const player: Player = {
        name: name,
        id: userId,
        icon: icon,
        points: 0,
        answer: "",
        canGuess: false,
        hasAnswered: false,
    }
    return player;
}

function selectIcon(data: any, userId: any) {
    const room = getRoom(data.room_code);
    if (room === null) { return }
    const player = room.players.find((player: Player) => player.id === userId);
    if (player === undefined) { return }
    if (data.icon === undefined) { return }
    if (room.remainingIcons.has(data.icon) === false) { return }
    room.remainingIcons.delete(data.icon);
    room.remainingIcons.add(player.icon);
    player.icon = data.icon;
    broadcastMessage(room, "icon_selected");
}

function createRoom(data: any, userId: any) {
    if (data.name === undefined || data.name === "") { return }
    const host = createPlayer(data.name, userId, "bear");
    const code = data.room_code ? data.room_code : generateRandomString(6);
    if (getRoom(code) !== null) { return }

    const room: Room = {
        roomCode: code,
        hostId: host.id,
        players: [host],
        firstPlayerIndex: 0,
        currQuestion: "",
        currPlayerId: host.id,
        remainingAnswers: [],
        remainingIcons: new Set(["cat", "chicken", "cow", "dog", "fox", "horse", "lion", "mouse", "panda", "pig", "sheep", "snake", "tiger"]),
        roundNumber: -1,
        guessing: false,
    }
    rooms[room.roomCode] = room;

    const msg_body = {
        text: `${host.name} has created the room with code ${room.roomCode}`
    }
    broadcastMessage(room, "new_room", msg_body);
}

function joinRoom(data: any, userId: any) {
    if (data.name === undefined || data.room_code === undefined || data.name === "") { return }
    const room = getRoom(data.room_code);
    if (room === null || room.roundNumber !== -1) { return }

    // User is already in the room
    const index = room.players.findIndex((player: Player) => player.id === userId);
    if (index !== -1) { return }

    // get the first icon from the remainingIcons array and remove it from the array
    const icon = room.remainingIcons.keys().next().value;
    room.remainingIcons.delete(icon);
    if (icon === undefined) { return }

    const player = createPlayer(data.name, userId, icon);
    room.players.push(player);

    const msg_body = {
        text: `${player.name} has joined the room`
    }
    broadcastMessage(room, "new_player", msg_body);

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
    broadcastMessage(room, "start_game");
    newRound(room.roomCode);
}

function submitAnswer(data: any, userId: string) {
    const answer = data.answer;

    const room = getRoom(data.room_code);
    if (room === null) { return }
    const player = room.players.find((player: Player) => player.id === userId);
    if (player === undefined || player.answer !== "" || room.guessing || room.roundNumber === -1) { return }

    player.answer = answer;
    player.hasAnswered = true;
    room.remainingAnswers.push(answer);

    // filter room.players to players which have an answer != ""
    const playersWithAnswers = room.players.filter((player: Player) => player.answer !== "").map((player: Player) => player.name);
    // map to only return the player name

    const msg_body = {
        text: `${player.name} has submitted an answer`,
        submitted: playersWithAnswers
    }
    broadcastMessage(room, "new_answer", msg_body);

    if (room.remainingAnswers.length === room.players.length) {
        moveToGuess(room);
    }
}

function moveToGuess(room: Room) {
    room.guessing = true;
    broadcastMessage(room, "move_to_guess");
    const player = room.players[room.firstPlayerIndex];
    if (player === undefined) { return }
    player.canGuess = true;
    setPlayerTurn(room, player);
}

function setPlayerTurn(room: Room, player: Player) {
    if (player === undefined || !player.canGuess) { return }

    room.currPlayerId = player.id;
    const msg_body = {
        text: `Player ${player.name} can guess`,
    }
    broadcastMessage(room, "set_player_turn", msg_body);
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
        room.currPlayerId = player.id;

        const msg_body = {
            text: `Correct guess! ${player.name} gets a point!`,
        }
        broadcastMessage(room, "answers", msg_body);

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

function newRound (roomCode: string) {
    const room = getRoom(roomCode);
    if (room === null) { return }
    room.guessing = false;
    room.remainingAnswers = [];

    // Reset player answers and canGuess to true
    for (let player of room.players) {
        player.answer = "";
        player.hasAnswered = false;
        player.canGuess = false;
    }

    room.firstPlayerIndex = (room.firstPlayerIndex + 1)%room.players.length;
    room.players[room.firstPlayerIndex].canGuess = true;

    room.roundNumber += 1;
    if (room.roundNumber > room.players.length) {
        room.roundNumber = -1;
        broadcastMessage(room, "end_game");
        return
    }

    // TODO: Get questions from file
    const question = "What is the best color?";
    room.currQuestion = question;
    
    broadcastMessage(room, "new_round");
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

        broadcastMessage(room, "disconnected", msg_body);
    });    
}

// Send message to all clients in a room
function broadcastMessage(room: Room, type: string, data?: any) {
    const roomCode = room.roomCode;
    const message: Message = {
        type: type,
        hostId: room.hostId,
        room_code: roomCode,
        round: room.roundNumber,
        guessing: room.guessing,
        question: room.currQuestion,
        currentPlayerId: room.currPlayerId,
        // TODO: remove players answers from message
        players: room.players,
        answers: room.remainingAnswers,
        remainingIcons: [...room.remainingIcons],
        ...data
    }


    for (let player of room.players) {
        const client = connections[player.id];
        if (client.readyState === WebSocket.OPEN) {
            const msgAdd = {...message, ...{playerId: player.id}};
            const toSend = JSON.stringify(msgAdd);
            client.send(toSend);
        }
    }
}