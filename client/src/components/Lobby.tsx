import { useState } from "react";
import Help from "./Help";
import  PlayerIcon, { iconMap } from "./PlayerIcon";

function Lobby({sendJsonMessage, isHost, remainingIcons}: {sendJsonMessage: any, isHost: boolean, remainingIcons: string[]}) {
    
    const [open, setOpen] = useState(false);
    const textModal = "The game is split into two rounds. In the first round you will be presented with a question. After answering the question, one player will have a chance to guess who said what. For each guess you make you will get one point. Be careful though, if any of your guesses are wrong you get no points! The next player will then have a chance to guess the remaining answers."

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
            <div className="px-5 py-2 md:p-10 shadow-xl rounded-2xl w-full">
                <div className='pb-2'>
                    <h3 className='pb-4 md:pb-10'>Select your icon:</h3>
                    <div className='grid grid-cols-3 gap-2 md:grid-cols-7'>
                    {Object.keys(iconMap).map((iconName: string, idx:number) => {
                        if (remainingIcons.includes(iconName)) {
                            return (
                                <div key={iconName+idx} className='hover:scale-110 duration-500 p-2 lg:p-4 cursor-pointer' onClick={() => selectIcon(iconName)}> 
                                    <PlayerIcon iconName={iconName}/>
                                </div>
                            ) 
                        } else {
                        return  (
                            <div key={iconName+idx} className='filter grayscale p-2 lg:p-4 brightness-75'> 
                                <PlayerIcon iconName={iconName}/>
                            </div>
                        )}
                    })}
                    </div>
                </div>
            </div>
            {isHost && 
            <div className='text-center pb-4 pt-8 md:pt-15'>
                <button className='button-orange hover:scale-110 duration-500 p-2 pr-8 pl-8' onClick={startGame}><h3>Start Game!</h3></button>
            </div>
            }

            {!isHost &&
            <div className='text-center pb-4 pt-8 md:pt-15'>
                <h4>Waiting for host to start the game. While you wait,&nbsp;
                    <span onClick={() => setOpen(true)} className="text-blue-300 underline hover:cursor-pointer">learn how to play</span>!
                </h4>
            </div>
            }   

            <Help open={open} setOpen={setOpen} title={"How to Play"} text={textModal} />
        </div>
    )
}

export default Lobby;