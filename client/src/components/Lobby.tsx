import  PlayerIcon, { iconMap } from "./PlayerIcon";

function Lobby({sendJsonMessage, isHost, remainingIcons}: {sendJsonMessage: any, isHost: boolean, remainingIcons: string[]}) {
    
    const startGame = () => {
        sendJsonMessage({
            "type": "start_game",
        });
    };

    const selectIcon = (iconName: string) => {
        sendJsonMessage({
            "type": "select_icon",
            "icon": iconName,
        });
    };

    return (
        <div>
            <div className="container mx-auto p-10 shadow-xl rounded-2xl w-full">
                <div className='pb-2'>
                    <h3 className='pb-10'>Select your icon:</h3>
                    <div className='grid grid-cols-3 gap-2 md:grid-cols-7'>
                    {Object.keys(iconMap).map((iconName: string, idx:number) => {
                        if (remainingIcons.includes(iconName)) {
                            return (
                                <div key={iconName+idx} className='hover:scale-110 duration-500 p-2 md:p-4' onClick={() => selectIcon(iconName)}> 
                                    <PlayerIcon iconName={iconName}/>
                                </div>
                            ) 
                        } else {
                        return  (
                            <div key={iconName+idx} className='filter grayscale p-2 md:p-4'> 
                                <PlayerIcon iconName={iconName}/>
                            </div>
                        )}
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