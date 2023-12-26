export interface Player {
    name: string,
    id: string,
    icon: string,
    points: number,
    answer: string
    canGuess: boolean,
    hasAnswered: boolean,
    disconnected: boolean,
}

export interface Room {
    roomCode: string,
    hostId: string,
    players: Player[],
    currQuestion: string,
    currPlayerId: string,
    remainingAnswers: string[],
    remainingIcons: Set<string>,
    firstPlayerIndex: number,
    roundNumber: number,
    guessing: boolean,
}

export interface Message {
    type: string,
    [key: string]: any;
}