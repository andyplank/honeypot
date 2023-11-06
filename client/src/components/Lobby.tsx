import {useState} from 'react';

function Lobby({lastMessage, readyState, sendJsonMessage, roomCode, setRoomCode}: {lastMessage: any, readyState: any, sendJsonMessage: any, roomCode: any, setRoomCode: any}) {
        
    const [username, setUsername] = useState('');

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

    const startGame = () => {
        sendJsonMessage({
            "type": "start_game",
            "name": username,
            "room_code": roomCode
        });
    };

    return (
        <div>
            <div>
                <div>
                    <p>Hello, user! Enter your name</p>
                    <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
            </div>
            <div>
                <button onClick={createRoom}>Create new room</button>
                <span> or join a room</span>
                <input name="roomCode" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} type="text" className="form-control" placeholder="Room code" aria-label="Room code" aria-describedby="basic-addon1" />
                <button onClick={joinRoom}>Join room</button>
            </div>
            <div>
                <button onClick={startGame}>Start Game</button>
            </div>
        </div>
    )
}

export default Lobby;