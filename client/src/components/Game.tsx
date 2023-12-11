import Answer from "./Answer";
import Guess from "./Guess";
import Lobby from "./Lobby";

interface Player {
    name: string,
    id: string,
    icon: string,
    points: number,
    answer: string
    canGuess: boolean,
}

function Game({sendJsonMessage, lastMessageJson}: {sendJsonMessage: any, lastMessageJson: any}) {

    let round:number = -1;
    let players:Player[] = [];
    let guessing:boolean = false;
    if (lastMessageJson!== null) {
        guessing = lastMessageJson.guessing ? lastMessageJson.guessing : false;
        round = lastMessageJson.round ? lastMessageJson.round : -1;
        players = lastMessageJson.players ? lastMessageJson.players : [];
    }

    const guessOrAnswer = () => {
        if (guessing) {
            return <Guess sendJsonMessage={sendJsonMessage} />
        } else if (round === -1) {
            return <Lobby sendJsonMessage={sendJsonMessage} />
        }   else {
            return <Answer sendJsonMessage={sendJsonMessage} />
        }
    }

    return (
        <div className="h-full">
            <div className='grid grid-cols-4 gap-4 h-full hidden sm:grid'>
                <div className='bg-light-purple pb-4 pr-4'>
                    <h3 className='p-4'>Players</h3>
                    {players.map((player:Player) => (
                        <h4>
                            <div className="bg-white rounded-r-lg mt-2 p-1" key={player.id}>{player.name} : {player.points}</div> 
                        </h4>
                    ))}
                </div>
                <div className='col-span-3'>
                    <div className='p-4'>
                        {guessOrAnswer()}
                    </div>
                </div>
            </div>  

            <div className='h-full block sm:hidden'>
                <div className='bg-light-purple pb-4 pr-4'>
                    <h3 className='p-4'>Players</h3>
                    {players.map((player:Player) => (
                        <h4>
                            <div className="bg-white rounded-r-lg mt-2 p-1" key={player.id}>{player.name} : {player.points}</div> 
                        </h4>
                    ))}
                </div>
                <div>
                    <div className='p-4'>
                        {guessOrAnswer()}
                    </div>
                </div>
            </div>     
        </div>
    )
}

export default Game;
