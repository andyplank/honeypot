import {useState} from 'react';

function Join({sendJsonMessage, roomCode, setRoomCode}: {sendJsonMessage: any, roomCode: any, setRoomCode: any}) {
        
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
        });
    };

    return (
        <div className='bg-light-purple p-4'>
            <div className='container-box container p-4'>
                <div>
                    <div>
                        <h2>Hello!</h2>
                        <h4>Enter your username</h4>
                        <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div className='content-center pt-2'>
                    <p className='pr-2'>Create new room</p>
                    <button className='button-orange w-1/3' onClick={createRoom}>Create</button>
                </div>
                <div className='pt-2'>
                    <span> Or join an existing room</span>
                    <input name="roomCode" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} type="text" className="form-control" placeholder="Room code" aria-label="Room code" aria-describedby="basic-addon1" />
                    <button onClick={joinRoom}>Join room</button>
                </div>
            </div>
        </div>
    )
}

export default Join;