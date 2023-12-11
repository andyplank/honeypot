function Lobby({sendJsonMessage, isHost}: {sendJsonMessage: any, isHost: boolean}) {
        
    const startGame = () => {
        sendJsonMessage({
            "type": "start_game",
        });
    };

    return (
        <div >
            <div className="container p-10 shadow-xl rounded-2xl">
                <div className='pb-4'>
                    <h3 className='pb-20'>Select your icon:</h3>
                </div>
            </div>
            {isHost && 
            <div className='text-center pt-20'>
                <button className='button-orange hover:scale-110 duration-500 p-2 pr-8 pl-8' onClick={startGame}><h3>Start Game!</h3></button>
            </div>
            }

            {/* OR if user isn't host, show this: */}
            <div className='text-center pt-20'>
                <h4>Waiting for host to start game...</h4>
            </div>
        </div>
    )
}

export default Lobby;