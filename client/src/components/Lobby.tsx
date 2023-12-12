import  PlayerIcon, { iconMap } from "./PlayerIcon";

function Lobby({sendJsonMessage, isHost}: {sendJsonMessage: any, isHost: boolean}) {
    
    const startGame = () => {
        sendJsonMessage({
            "type": "start_game",
        });
    };

    return (
        <div>
            <div className="container mx-auto p-10 shadow-xl rounded-2xl w-full">
                <div className='pb-2'>
                    <h3 className='pb-10'>Select your icon:</h3>
                    <div className='grid grid-cols-4 gap-2 md:grid-cols-7'>
                    {Object.keys(iconMap).map((iconName: string) => {
                        return  <div className='hover:scale-110 duration-500'> 
                                    <PlayerIcon iconName={iconName}/>
                                </div>
                    })}
                    </div>
                </div>
            </div>
            {isHost && 
            <div className='text-center pt-20'>
                <button className='button-orange hover:scale-110 duration-500 p-2 pr-8 pl-8' onClick={startGame}><h3>Start Game!</h3></button>
            </div>
            }

            {!isHost &&
            <div className='text-center pt-20'>
                <h4>Waiting for host to start the game...</h4>
            </div>
            }           
        </div>
    )
}

export default Lobby;