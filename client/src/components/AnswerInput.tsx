import {useState} from 'react';
import verifyInput from './InputVerify';

const AnswerInput = ({sendJsonMessage, hasAnswered}: {sendJsonMessage: any, hasAnswered:boolean}) => {
        
    const [answer, setAnswer] = useState('');

    const submitAnswer = () => {
        sendJsonMessage({
            "type": "submit_answer",
            "answer": answer
        });
    }

    if (hasAnswered) {
        return <h4 className='pb-4'>You have submitted your answer!</h4>
    }

    const answerInput = (inStr: string) => {
        if (!verifyInput(inStr, 50)) return;
        setAnswer(inStr.toLocaleLowerCase());
    }

    return (
        <>
            <input name="answer" readOnly={hasAnswered} value={answer} 
                onChange={(e) => answerInput(e.target.value)} 
                type="text" 
                className="orange-input pt-5" 
                aria-label="Answer" 
                aria-describedby="answer-input-box" 
                onKeyDown={(e) => { 
                    if (e.key === "Enter") { 
                        submitAnswer(); 
                    } 
                }} />
            <button className='button-orange focus:ring p-1 pr-4 pl-4 mt-3' onClick={submitAnswer}><h4>Submit Answer</h4></button>
        </>
    )
}

export default AnswerInput;