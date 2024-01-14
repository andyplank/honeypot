import {useState} from 'react';
import { Player } from './Player';
import GuessItem from './GuessItem';
import Help from './Help';

const Guess = ({sendJsonMessage, players, answers, currentPlayerId, playerId, prompt}: {sendJsonMessage: any, players: Player[], answers: string[], currentPlayerId: string, playerId: string, prompt: string}) => {
   
    const [open, setOpen] = useState(false);
    const [guesses, setGuesses] = useState(new Array(answers.length).fill("none"));
    const addGuess = (index:number, guessedPlayerId:string) => {
        const copy = [...guesses];
        copy[index] = guessedPlayerId;
        setGuesses(copy);        
    }

    const pickingPlayer = players.find((player:Player) => player.id === currentPlayerId);
    const isPicking = playerId === currentPlayerId;
    const playersWithoutSelf = players.filter((player:Player) => player.id !== playerId);

    const textModal = "Guess who said what! For each guess you make you will get one point. Be careful though, if any of your guesses are wrong you get no points!"

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
        <div className="w-full shadow-xl rounded-2xl p-6 md:p-10">
            <h3 className='pb-6'>{prompt}</h3>
            <div className='flex pb-5'>
                <h4 className='pr-4 text-green'>Now guessing: </h4>
                <h4 className='text-green'>{pickingPlayer?.name}</h4>
            </div>
            <h4 className='pr-4 text-green pb-2'>
                Guess who said which answer! 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-2 w-6 h-6 inline cursor-pointer" onClick={() => setOpen(true)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2'>
                {answers.map((answer:string, idx:number) => (
                    <GuessItem key={idx} index={idx} answer={answer} players={playersWithoutSelf} addGuess={addGuess} currentGuessId={guesses[idx]} isPicking={isPicking}/> 
                ))}
            </div>

            <div className='pt-4'>
                <button className='button-orange p-1 pr-4 pl-4 disabled:opacity-50' disabled={!isPicking} onClick={submitGuess}><h4>
                    {isPicking &&
                        "Submit Guess"
                    }    
                    {!isPicking &&
                    <div className='pt-2 '>
                    <p className=''>Waiting for your turn</p>
                    <svg className="h-2 inline animate-bounce [animation-delay:-0.3s] mt-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="50" />
                    </svg>
                    <svg className="h-2 inline animate-bounce [animation-delay:-0.15s] mx-1 mt-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="50" />
                    </svg>
                    <svg className="h-2 inline animate-bounce mt-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="50" />
                    </svg>
                </div>
                    }
                </h4></button>
            </div>
            <Help open={open} setOpen={setOpen} title={"Help"} text={textModal} />
        </div>
    )
}

export default Guess;