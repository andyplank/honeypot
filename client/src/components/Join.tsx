import {useEffect, useState} from 'react';
import verifyInput from './InputVerify';

const Join = ({sendJsonMessage, roomCode, setRoomCode}: {sendJsonMessage: any, roomCode: any, setRoomCode: any}) => {
        
    const [username, setUsername] = useState('');
    
    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        window.history.pushState({}, document.title, "/")
        const roomParam = queryParameters.get("room")
        if (roomParam === undefined || roomParam === null) return;
        roomCodeInput(roomParam);
    });

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

    const usernameInput = (inStr: string) => {
        if (!verifyInput(inStr, 10)) return;
        setUsername(inStr);
    }

    const roomCodeInput = (inStr: string) => {
        if (!verifyInput(inStr, 6)) return;
        setRoomCode(inStr.toLocaleUpperCase());
    }

    return (
        <div className='grow bg-light-purple justify-center items-center flex'>
            <div>
                <div className='bg-white drop-shadow-lg shadow-sm p-5 md:p-10 text-center m-5 rounded-2xl'>
                    <div className='pb-6'>
                        <h2>Hello!</h2>
                        <h3>Let's get started</h3>
                    </div>
                    <div>
                        <div className="pb-20">
                            <h4 className='text-left pb-2'>Enter your username:</h4>
                            <input name="username" type="text" aria-label="Username"
                                value={username} onChange={(e) => usernameInput(e.target.value)} 
                                className="orange-input" />
                        </div>
                        <div>
                            <h4 className='text-left pb-2'>Enter a room code:</h4>
                            <input name="roomCode" type="text" aria-label="Room code"
                                value={roomCode} onChange={(e) => roomCodeInput(e.target.value)} 
                                className="orange-input" />
                            <div className='pt-4'>
                                <button 
                                className='button-orange w-full	focus:ring hover:scale-110 duration-500 p-1 pr-4 pl-4' onClick={joinRoom} >
                                    <p>Join an existing room</p>
                                </button>
                            </div>
                        </div>
                                <p className='italic p-4'>Or</p>
                        <div className="">
                            <div className='pt-2'>
                                <button className='button-orange w-full	focus:ring hover:scale-110 duration-500 p-1 pr-4 pl-4' onClick={createRoom} >
                                    <p>Create a new room</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Join;