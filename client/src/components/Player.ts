export interface Player {
    name: string,
    id: string,
    icon: string,
    points: number,
    answer: string
    canGuess: boolean,
    hasAnswered: boolean,
}