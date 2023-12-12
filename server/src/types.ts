export interface Player {
    name: string,
    id: string,
    icon: string,
    points: number,
    answer: string
    canGuess: boolean,
    hasAnswered: boolean,
}

export interface Room {
    roomCode: string,
    hostId: string,
    players: Player[],
    currQuestion: string,
    currPlayerId: string,
    remainingAnswers: string[],
    remainingIcons: string[],
    firstPlayerIndex: number,
    roundNumber: number,
    guessing: boolean,
}

export interface Message {
    type: string,
    [key: string]: any;
}