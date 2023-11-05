export interface Player {
    name: string,
    id: string,
    points: number,
    answer: string
    canGuess: boolean,
}

export interface Room {
    roomCode: string,
    hostId: string,
    players: Player[],
    currQuestion: string,
    remainingAnswers: string[],
    firstPlayerIndex: number,
}

export interface Message {
    type: string,
    [key: string]: any;
}