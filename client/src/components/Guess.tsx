import {useState} from 'react';
import { Player } from './Player';
import GuessItem from './GuessItem';

const Guess = ({sendJsonMessage, players, answers, currentPlayerId, playerId, prompt}: {sendJsonMessage: any, players: Player[], answers: string[], currentPlayerId: string, playerId: string, prompt: string}) => {
    
    const [guesses, setGuesses] = useState(new Array(answers.length).fill("none"));
    const addGuess = (index:number, guessedPlayerId:string) => {
        const copy = [...guesses];
        copy[index] = guessedPlayerId;
        setGuesses(copy);        
    }

    const pickingPlayer = players.find((player:Player) => player.id === currentPlayerId)?.name;
    const isPicking = playerId === currentPlayerId;
    const playersWithoutSelf = players.filter((player:Player) => player.id !== playerId);

    const submitGuess = () => {
        let pairs = [];
        for (let i=0; i<guesses.length; i++) {
            if (guesses[i] !== "none") {
                pairs.push([guesses[i], answers[i]]);
            }
        }
        sendJsonMessage({
            "type": "guess",
            "pairs": pairs,
        });
        setGuesses(new Array(answers.length).fill("none"));
    }

    return (
        <div className="container p-4">
            <h4 className='pb-3 text-purple'>Prompt:</h4>
            <h3 className='pb-6 '>{prompt}</h3>
            <div className='flex'>
                <h4 className='pr-4 text-green'>Now Picking: </h4>
                <h4 className='pb-10 text-green'>{pickingPlayer}</h4>
            </div>
            <h4 className='pr-4 text-green pb-2'>Answers: </h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mt-auto'>
                {answers.map((answer:string, idx:number) => (
                    <div key={idx}><GuessItem index={idx} answer={answer} players={playersWithoutSelf} addGuess={addGuess} currentGuessId={guesses[idx]} isPicking={isPicking}/></div> 
                ))}
            </div>

            {isPicking &&
                <div className='pt-4'>
                    <button className='button-orange p-1 pr-4 pl-4' onClick={submitGuess}><h4>Submit Guess</h4></button>
                </div>
            }
        </div>
    )
}

export default Guess;