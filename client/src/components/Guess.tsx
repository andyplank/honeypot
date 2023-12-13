import {useState} from 'react';
import { Player } from './Player';

const Guess = ({sendJsonMessage, players, answers, currentPlayerId, playerId, prompt}: {sendJsonMessage: any, players: Player[], answers: string[], currentPlayerId: string, playerId: string, prompt: string}) => {
    
    const [guessPlayer, setGuessPlayer] = useState('');
    const [guessAnswer, setGuessAnswer] = useState('');
    
    const pickingPlayer = players.find((player:Player) => player.id === currentPlayerId)?.name;
    if (playerId === currentPlayerId) {
        console.log('current player is picking');
    }

    const submitGuess = () => {
        sendJsonMessage({
            "type": "guess",
            "guessed_player": guessPlayer,
            "guessed_answer": guessAnswer,
        });
    }

    return (
        <div className="container p-4">
            <h4 className='pb-4 text-purple'>Prompt:</h4>
            <h3 className='pb-10'>{prompt}</h3>
            <div className='flex'>
                <h4 className='pr-4 text-green'>Now Picking: </h4>
                <h4 className='pb-10 text-green'>{pickingPlayer}</h4>
            </div>
            <h4 className='pr-4 text-green'>Answers: </h4>
            <div className='grid grid-cols-3 gap-2 mt-auto'>
                {answers.map((answer:string, idx:number) => (
                    <div key={idx} className='bg-white outline outline-1 rounded-2xl mt-2 p-1 pr-4 pl-4 mr-4'>{answer}</div> 
                ))}
            </div>
            <div className="container p-10 shadow-xl rounded-2xl">
                <div className='pb-4'>
                    <h4>
                        <input name="guessAnswer" value={guessAnswer} onChange={(e) => setGuessAnswer(e.target.value)} type="text" className="orange-input pt-5" placeholder="Guess" aria-label="Guess" aria-describedby="basic-addon1" />
                        <input name="guessPlayer" value={guessPlayer} onChange={(e) => setGuessPlayer(e.target.value)} type="text" className="orange-input pt-5" placeholder="Guess Player" aria-label="Guess Player" aria-describedby="basic-addon1" />
                    </h4>
                </div>
                <div>
            </div>
                <div>
                    <button className='button-orange p-1 pr-4 pl-4' onClick={submitGuess}><h4>Submit Guess</h4></button>
                </div>
            </div>
        </div>
    )
}

export default Guess;