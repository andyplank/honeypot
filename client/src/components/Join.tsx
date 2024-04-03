import {useEffect, useState} from 'react';
import verifyInput from './InputVerify';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Join = ({sendJsonMessage, roomCode, setRoomCode}: {sendJsonMessage: any, roomCode: any, setRoomCode: any}) => {
        
    const [username, setUsername] = useState('');
    const [type, setType] = useState('');
    
    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        window.history.pushState({}, document.title, "/")
        const roomParam = queryParameters.get("room")
        if (roomParam === undefined || roomParam === null) return;
        roomCodeInput(roomParam);
    });

    const createRoom = () => {
        setType("create_room");
    };

    const joinRoom = () => {
        setType("join_room");
    };

    const enterRoom = () => {
        sendJsonMessage({
            "type": type,
            "name": username,
        });
    };

    const goBack = () => {
        setType("");
        setRoomCode("");
    };

    const usernameInput = (inStr: string) => {
        if (!verifyInput(inStr, 10)) return;
        setUsername(inStr);
    }

    const roomCodeInput = (inStr: string) => {
        if (!verifyInput(inStr, 6)) return;
        setRoomCode(inStr.toLocaleUpperCase());
        setType("join_room");
    }

    return (
        <div className='grow bg-light-purple justify-center items-center flex'>
            <div>
                {type !== "" && 
                <div>
                    <div className='bg-white drop-shadow-lg shadow-sm p-5 md:p-10 m-5 rounded-2xl'>
                        <div className='pb-6 text-center'>
                            <h3>Let's get started!</h3>
                        </div>
                        <div>
                            <div className="pb-10">
                                <h4 className='text-left pb-2'>Enter your name:</h4>
                                <input 
                                    name="username" 
                                    type="text" 
                                    aria-label="Username"
                                    value={username} 
                                    onChange={(e) => usernameInput(e.target.value)} 
                                    onKeyDown={(e) => { 
                                        if (e.key === "Enter") { 
                                            enterRoom(); 
                                        } 
                                    }}
                                    className="orange-input" />
                            </div>
                            {type === "join_room" && 
                                <div className="pb-10">
                                    <h4 className='text-left pb-2'>Enter room code:</h4>
                                    <input 
                                        name="roomCode" 
                                        type="text" 
                                        aria-label="Room code"
                                        value={roomCode} 
                                        onChange={(e) => roomCodeInput(e.target.value)} 
                                        onKeyDown={(e) => { 
                                            if (e.key === "Enter") { 
                                                enterRoom(); 
                                            } 
                                        }}
                                        className="orange-input" />
                                </div>
                            }
                            <div>
                                <div className='pt-2'>
                                    <button className='button-orange w-full focus:ring hover:scale-110 duration-500 p-1 pr-4 pl-4' onClick={enterRoom} >
                                        <p>Enter Game</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={goBack}>
                            <div className="flex items-center">
                                <ArrowLeftIcon className="h-9 w-9" aria-hidden="true" />
                                <p>Go Back</p>
                            </div>
                    </button>
                </div>
                }
            </div>
            <div>
                {type === "" && 
                <div className='bg-white drop-shadow-lg shadow-sm p-5 md:p-10 text-center m-5 rounded-2xl'>
                    <div className='pb-8 border-b-4 border-purple'>
                        <h3 className='pb-2'>Welcome to Honeypot!</h3>
                        <h5 className='max-w-md'>The online party game where you answer questions and guess who said what!</h5>
                    </div>
                    <div>
                        <div className='pt-6'>
                            <div className='pt-4'>
                                <button 
                                className='button-orange w-full focus:ring hover:scale-110 duration-500 p-1 pr-4 pl-4' onClick={joinRoom} >
                                    <h4>Join an existing room</h4>
                                </button>
                            </div>
                        </div>
                        <p className='italic p-4'>Or</p>
                        <div className="">
                            <div className='pt-2'>
                                <button className='button-orange w-full focus:ring hover:scale-110 duration-500 p-1 pr-4 pl-4' onClick={createRoom} >
                                    <h4>Create a new room</h4>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>        
    )
}

export default Join;