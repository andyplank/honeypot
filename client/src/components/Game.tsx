import Answer from "./Answer";
import Guess from "./Guess";

function Game({sendJsonMessage, lastMessageJson}: {sendJsonMessage: any, lastMessageJson: any}) {

    let points:any = {};
    let round:number = -1;
    let players:string[] = [];
    let guessing:boolean = false;
    if (lastMessageJson!== null) {
        guessing = lastMessageJson.guessing ? lastMessageJson.guessing : false;
        points = lastMessageJson.points ? lastMessageJson.points : {};
        round = lastMessageJson.round ? lastMessageJson.round : -1;
        players = lastMessageJson.players ? lastMessageJson.players : [];
    }

    const guessOrAnswer = () => {
        if (guessing) {
            return <Guess sendJsonMessage={sendJsonMessage} />
        } else {
            return <Answer sendJsonMessage={sendJsonMessage} />
        }
    }

    return (
        <div>
            <div className='grid grid-cols-3 gap-4'>
                <div className='bg-light-purple p-4'>
                    <h3 className="">Players</h3>
                    {players.map((player:string, idx:number) => (
                        <div className="bg-white font-bold mt-2" key={idx}>{player} : {points[player]}</div> 
                    ))}
                </div>
                <div className='col-span-2 bg-black'>
                    <div className='p-4'>
                        {guessOrAnswer()}
                    </div>
                </div>
            </div>    
        </div>
    )
}

export default Game;
