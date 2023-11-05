export interface Player {
    name: string;
    points: number;
}

export interface Room {
    code: string,
    hostName: string,
    players: Player[],
    currQuestion: string,
    answers: Answer[]
}

export interface Answer {
    text: string,
    playerName: string
}