import { Room, Player, Message } from './types';
import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

let prompts:string[] = ["Test prompt"];
try {
    const fileContent = fs.readFileSync('./prompts.txt').toString();
    prompts = fileContent.split('\n');
} catch (error) {
    console.log("Error reading prompts.txt");
}

const rooms:any = {};
const connections:any = {};
const playerToRoom:any = {};

const typesDef = {
    create_room: 'create_room',
    join_room: 'join_room',
    start_game: 'start_game',
    submit_answer: 'submit_answer',
    guess: 'guess',
    select_icon: 'select_icon',
    rejoin: 'rejoin',
    play_again: 'play_again',
}

// Entry point for a new player
export function newConnection(connection: any) {
    const userId = uuidv4();
    console.log(`Recieved a new connection ${userId}`);
    connections[userId] = connection;
    connection.on('message', (message: any) => handleMessage(message, userId));
    connection.on('close', () => handleDisconnect(userId));
}

function handleMessage(message: any, userId: any) {
    let data;
    try {
        data = JSON.parse(message.toString());
    } catch (error) {
        return;
    }

    console.log(data);
    if (data.room_code !== undefined && data.room_code !== "") { 
        if (!validString(data.room_code, 6)) return;
        data.room_code = data.room_code.toUpperCase();
    }
    
    const msgType = data.type;
    switch (msgType) {
        case typesDef.create_room:
            createRoom(data, userId);
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
        case typesDef.rejoin:
            rejoin(data, userId);
            break;
        case typesDef.guess:
            guess(data, userId);
            break;
        case typesDef.play_again:
            playAgain(data, userId);
            break;
        default:
    }
}

function playAgain(data: any, userId: any) {
    const room = getRoom(data.room_code);
    if (room === null) { return }
    if (room.hostId !== userId) {
        return;
    }
    room.roundNumber = -1;
    for (let player of room.players) {
        player.points = 0;
    }
    broadcastMessage(room, "new_game");
}

function rejoin(data: any, userId: any) {
    const room = getRoom(data.room_code);
    if (room === null) { return }
    const player = room.players.find((player: Player) => player.id === data.playerId);
    if (player === undefined || player.disconnected === false) { return }

    if (room.hostId === player.id) {
        room.hostId = userId;
    }

    playerToRoom[userId] = data.room_code;
    room.connectedPlayers += 1;
    player.id = userId;
    player.disconnected = false;

    broadcastMessage(room, "reconnected");
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
        disconnected: false,
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

function deleteRoom(roomCode: string) {
    if (!validString(roomCode, 6)) return;
    const room = rooms[roomCode];
    if (room === undefined) return;
    for (let player of room.players) {
        if (connections[player.id] !== undefined) {
            delete connections[player.id];
        }
    }
    delete rooms[roomCode];
    rooms[roomCode] = undefined;
}

function createRoom(data: any, userId: any) {
    if (!validString(data.name, 10)) return;
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
        pastQuestions: new Set([]),
        connectedPlayers: 1,
    }
    rooms[code] = room;
    playerToRoom[userId] = data.room_code;

    setTimeout((roomCode) => {
        deleteRoom(roomCode);
    }, 7200000, code);

    broadcastMessage(room, "new_room");
}

function joinRoom(data: any, userId: any) {
    if (!validString(data.name, 10)) return;
    const room = getRoom(data.room_code);
    if (room === null || room.roundNumber !== -1) { return }

    // User is already in a room
    if (userId in playerToRoom) { return }
    const index = room.players.findIndex((player: Player) => player.id === userId);
    if (index !== -1) { return }

    // get the first icon from the remainingIcons array and remove it from the array
    const icon:string = room.remainingIcons.keys().next().value;
    if (icon === undefined) { return }
    room.remainingIcons.delete(icon);

    const player = createPlayer(data.name, userId, icon);
    playerToRoom[userId] = data.room_code;
    room.players.push(player);
    room.connectedPlayers += 1;

    broadcastMessage(room, "new_player");
}

function startGame(data: any, userId: string) {
    const room = getRoom(data.room_code);
    if (room === null) { return }
    if (room.hostId !== userId) { return }

    room.roundNumber = 0;
    for (let player of room.players) {
        player.points = 0;
    }
    broadcastMessage(room, "start_game");
    newRound(room.roomCode);
}

const submitAnswer = (data: any, userId: string) => {
    if (!validString(data.answer, 50)) { return }
    const answer:string = data.answer.toUpperCase();

    const room = getRoom(data.room_code);
    if (room === null) { return }
    const player = room.players.find((player: Player) => player.id === userId);
    if (player === undefined || player.answer !== "" || room.guessing || room.roundNumber === -1) { return }

    player.answer = answer;
    player.hasAnswered = true;
    room.remainingAnswers.push(answer);

    broadcastMessage(room, "new_answer");

    if (room.remainingAnswers.length === room.players.length) {
        moveToGuess(room);
    }
}

function moveToGuess(room: Room) {
    room.guessing = true;
    room.remainingAnswers.sort(() => Math.random() - 0.5);
    broadcastMessage(room, "move_to_guess");
    if (room.firstPlayerIndex < 0 || room.firstPlayerIndex > room.players.length) { room.firstPlayerIndex = 0 }
    const player = room.players[room.firstPlayerIndex];
    player.canGuess = true;
    setPlayerTurn(room, player);
}

function setPlayerTurn(room: Room, player: Player) {
    if (player === undefined || !player.canGuess) { return }

    room.currPlayerId = player.id;
    broadcastMessage(room, "set_player_turn");
}

const verifyGuess = (room: Room, currUserId: string, guessedPlayerId:string, guessedAnswer: string) => {
    if (!validString(guessedAnswer, 50)) { return false }
    if (room.remainingAnswers.includes(guessedAnswer) === false) { return false }

    const guessedPlayer = room.players.find((player: Player) => player.id === guessedPlayerId);
    if (guessedPlayer === undefined || guessedPlayer.id === currUserId) { return false }
    
    if (guessedPlayer.answer === guessedAnswer) {
        return true;
    }

    return false;
}

const guess = (data: any, userId: string) => {
    const pairs: [string, string][] = data.pairs;

    const room = getRoom(data.room_code);
    if (room === null || room.roundNumber === -1 || !room.guessing) { return }

    const player = getPlayer(room, userId);
    if (player === undefined || !player.canGuess) { return }
    const playerInd = room.players.findIndex((player: Player) => player.id === userId);

    let correctAnswers = 0;
    let guessedAnswers:string[] = [];
    for (let pair of pairs) {
        const answer = pair[1];
        const guessedPlayerId = pair[0];
        guessedAnswers.push(answer);
        if (verifyGuess(room, userId, guessedPlayerId, answer)) {
            correctAnswers += 1;
        }
    }

    if (correctAnswers !== pairs.length) {
        const msg_body = {
            text: `Incorrect guess! ${player.name} had ${correctAnswers} of ${pairs.length} correct!`,
        }
        broadcastMessage(room, "answers", msg_body);
    
    } else {

        player.points += correctAnswers;
        for (let answer of guessedAnswers) {
            room.remainingAnswers.splice(room.remainingAnswers.indexOf(answer), 1);
        }

        if (room.remainingAnswers.length <= 1) {
            player.points += 1;

            const msg_body = {
                text: `Correct guess! ${player.name} gets ${correctAnswers} points and a bonus point for ending the round!`,
            }
            broadcastMessage(room, "answers", msg_body);

            newRound(room.roomCode);
            return

        } else {

            const msg_body = {
                text: `Correct guess! ${player.name} gets ${correctAnswers} points!`,
            }
            broadcastMessage(room, "answers", msg_body);
        }

    }
    
    player.canGuess = false;
    const nextPlayerInd = (playerInd + 1)%room.players.length;
    const nextPlayer = room.players[nextPlayerInd];
    if (nextPlayer === undefined) { return }
    nextPlayer.canGuess = true;
    setPlayerTurn(room, nextPlayer);
}

const newRound = (roomCode: string) => {
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
        room.roundNumber = -2;
        broadcastMessage(room, "end_game");
        return
    }

    let questionIndex = Math.floor(Math.random() * prompts.length);
    if (room.pastQuestions.has(questionIndex)) {
        if (room.pastQuestions.size === prompts.length) {
            room.pastQuestions.clear();
        }
        while (questionIndex in room.pastQuestions) {
            questionIndex = (questionIndex + 1) % prompts.length;
        }
    }
    const question = prompts[questionIndex];
    room.pastQuestions.add(questionIndex);
    room.currQuestion = question;

    broadcastMessage(room, "new_round");
}


function generateRandomString(length: number):string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

const getPlayer = (room: Room, userId: string) => {
    return room.players.find((player: Player) => player.id === userId);
}

function handleDisconnect(userId: string) {
    delete connections[userId];

    const roomId = playerToRoom[userId];
    if (!validString(roomId, 6)) return;
    
    const room = getRoom(roomId);
    if (room === null) { return }
    
    const player = room.players.find((player: Player) => player.id === userId);
    if (player === undefined) { return }
    player.disconnected = true;
    room.connectedPlayers -= 1;
    
    broadcastMessage(room, "disconnected");
    if (room.connectedPlayers === 0) {
        setTimeout((roomCode) => {
            const room = getRoom(roomCode);
            if (room !== null && room !== undefined && room.connectedPlayers === 0) {
                deleteRoom(room.roomCode);
            }
        }, 120000, room.roomCode);
    }
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
        if (player.disconnected) { continue }
        const client = connections[player.id];
        if (client.readyState === WebSocket.OPEN) {
            const msgAdd = {...message, ...{playerId: player.id}};
            const toSend = JSON.stringify(msgAdd);
            client.send(toSend);
        }
    }
}

function validString(str: string, maxLength: number) {
    if (typeof str !== "string") { return false }
    if (str === undefined || str === "") { return false }
    if (str.length > maxLength) { return false }
    for (let i = 0, len = str.length; i < len; i++) {
        const code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) && // lower alpha (a-z)
            !(code === 32 || code === 63 || code === 46 || code === 44) // space, ?, ., ,
        ) { 
            return false;
        }
      }
    return true;
}