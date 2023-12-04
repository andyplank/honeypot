import {useState} from 'react';

function Lobby({sendJsonMessage}: {sendJsonMessage: any}) {
        
    const startGame = () => {
        sendJsonMessage({
            "type": "start_game",
        });
    };

    return (
        <div>
            <div>
                <button onClick={startGame}>Start Game</button>
            </div>
        </div>
    )
}

export default Lobby;