import {useState} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';

function LoginSection({lastMessage, readyState, sendJsonMessage}: {lastMessage: any, readyState: any, sendJsonMessage: any}) {
        
    const [username, setUsername] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [answer, setAnswer] = useState('');

    const createRoom = () => {
        sendJsonMessage(({
            "type": "create_room",
            "name": username,
        }));
    };

    const joinRoom = () => {
        sendJsonMessage({
            "type": "join_room",
            "name": username,
            "room_code": roomCode
        });
    };

    const submitAnswer = () => {
        sendJsonMessage({
            "type": "submit_answer",
            "name": username,
            "room_code": roomCode,
            "answer": answer
        });
    }

    return (
        <div>
            <div>
                <div>
                    <p>Hello, user! Enter your name</p>
                </div>
                <div>
                    <p>WebSocket Status: {ReadyState[readyState]}</p>
                    <p>Last Message: {lastMessage && lastMessage.data}</p>
                </div>
                {/* Create an input for the roomCode state */}
                <input name="roomCode" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} type="text" className="form-control" placeholder="Room code" aria-label="Room code" aria-describedby="basic-addon1" />
                <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                {/* Crete an input for the answer state */}
                <input name="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} type="text" className="form-control" placeholder="Answer" aria-label="Answer" aria-describedby="basic-addon1" />
            </div>
            <div>
                <button onClick={createRoom}>Create room</button>
                <button onClick={joinRoom}>Join room</button>
                <button onClick={submitAnswer}>Submit Answer</button>
            </div>
        </div>
    )
}

export default LoginSection;