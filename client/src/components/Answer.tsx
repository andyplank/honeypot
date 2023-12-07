import {useState} from 'react';

function Answer({sendJsonMessage}: {sendJsonMessage: any}) {
        
    const [answer, setAnswer] = useState('');

    const prompt = "What is the best way to get to the moon?";

    const submitAnswer = () => {
        sendJsonMessage({
            "type": "submit_answer",
            "answer": answer
        });
    }

    return (
        <div className="p-4">
            <div className="container p-10 shadow-xl rounded-2xl">
                <div className='pb-4'>
                    <h3 className='pb-20'>{prompt}</h3>
                    <h4>
                        <input name="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} type="text" className="orange-input pt-5" aria-label="Answer" aria-describedby="basic-addon1" />
                    </h4>
                </div>
                <div>
                    <button className='button-orange p-1 pr-4 pl-4' onClick={submitAnswer}><h4>Submit Answer</h4></button>
                </div>
            </div>
            <div>
                <h4 className='pt-20'>Waiting on...</h4>
            </div>
            <div>
                <h4 className='pt-20'>Submitted!</h4>
            </div>
        </div>
    )
}

export default Answer;