import {useState} from 'react';

function Guess({sendJsonMessage}: {sendJsonMessage: any}) {
        
    const [guessPlayer, setGuessPlayer] = useState('');
    const [guessAnswer, setGuessAnswer] = useState('');
    
    const prompt = "What is the best way to get to the moon?";
    const pickingPlayer = "Player 1";

    const submitGuess = () => {
        sendJsonMessage({
            "type": "guess",
            "guessed_player": guessPlayer,
            "guessed_answer": guessAnswer,
        });
    }

    return (
        <div className="p-4">
            <h4 className='pb-4'>Prompt:</h4>
            <h3 className='pb-10'>{prompt}</h3>
            <div className='flex'>
                <h4 className='pr-4'>Now Picking: </h4>
                <h4 className='pb-10'>{pickingPlayer}</h4>
            </div>
            <h4 className='pr-4'>Answers: </h4>
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