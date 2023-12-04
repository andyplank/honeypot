import {useState} from 'react';

function Answer({sendJsonMessage}: {sendJsonMessage: any}) {
        
    const [answer, setAnswer] = useState('');

    const submitAnswer = () => {
        sendJsonMessage({
            "type": "submit_answer",
            "answer": answer
        });
    }

    return (
        <div>
            <input name="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} type="text" className="form-control" placeholder="Answer" aria-label="Answer" aria-describedby="basic-addon1" />
            <div>
                <button onClick={submitAnswer}>Submit Answer</button>
            </div>
        </div>
    )
}

export default Answer;