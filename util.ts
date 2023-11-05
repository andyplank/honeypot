import { Room, Player, Answer } from './types';

let rooms:Room[] = [];

function generateRandomString(length: number):string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      result += letters[randomIndex];
    }
    return result;
}

function getRoomIndex(code: string): number {
    return rooms.findIndex(room => room.code === code);
}

export function getRooms(req: any, res: any) {
    res.status(200).send({message: rooms});
}

export function newRoom(req:any, res:any) {
    const name = req.body.name
    // TODO: Validate name
    const host: Player = {
        name: name,
        points: 0,
    }
    // TODO: Switch to words
    const newRoom:Room = {
        code: generateRandomString(6),
        hostName: host.name,
        players: [host],
        currQuestion: "",
        answers: [],
    }
    rooms.push(newRoom);
    res.status(200).send({message: newRoom.code});
}

export function submitAnswer(req:any, res:any) {
    const name = req.body.name;
    const roomIndex = getRoomIndex(req.body.code);
    if (name === "" || roomIndex === -1) {
        res.status(400).send({});
    }
    const text = req.body.text;
    // TODO: error checking
    const answer:Answer = {
        playerName: name,
        text: text
    }
    rooms[roomIndex].answers.push(answer);
    res.status(200).send({});
}

export function nextRound() {
    
}