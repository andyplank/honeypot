import {useState} from 'react';

function Guess({sendJsonMessage}: {sendJsonMessage: any}) {
        
    const [guessPlayer, setGuessPlayer] = useState('');
    const [guessAnswer, setGuessAnswer] = useState('');


    const submitGuess = () => {
        sendJsonMessage({
            "type": "guess",
            "guessed_player": guessPlayer,
            "guessed_answer": guessAnswer,
        });
    }

    return (
        <div>
            <input name="guessAnswer" value={guessAnswer} onChange={(e) => setGuessAnswer(e.target.value)} type="text" className="form-control" placeholder="Guess" aria-label="Guess" aria-describedby="basic-addon1" />
            <input name="guessPlayer" value={guessPlayer} onChange={(e) => setGuessPlayer(e.target.value)} type="text" className="form-control" placeholder="Guess Player" aria-label="Guess Player" aria-describedby="basic-addon1" />
            <div>
                <button onClick={submitGuess}>Submit Guess</button>
            </div>
        </div>
    )
}

export default Guess;