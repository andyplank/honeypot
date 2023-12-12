import Answer from "./Answer";
import Guess from "./Guess";
import Lobby from "./Lobby";
import { Player } from "./Player";
import PlayerIcon from "./PlayerIcon";

function Game({sendJsonMessage, lastMessageJson}: {sendJsonMessage: any, lastMessageJson: any}) {

    let round:number = -1;
    let players:Player[] = [];
    let guessing:boolean = false;
    let hostId:string = "";
    let playerId:string = "myId";
    let prompt:string = "";
    let answers:string[] = [];
    let currentPlayerId:string = "";
    let remainingIcons:string[] = [];
    if (lastMessageJson!== null) {
        guessing = lastMessageJson.guessing ? lastMessageJson.guessing : false;
        round = lastMessageJson.round ? lastMessageJson.round : -1;
        players = lastMessageJson.players ? lastMessageJson.players : [];
        playerId = lastMessageJson.playerId ? lastMessageJson.playerId : "myId";
        hostId = lastMessageJson.hostId ? lastMessageJson.hostId : "";
        prompt = lastMessageJson.question ? lastMessageJson.question : "";
        answers = lastMessageJson.answers ? lastMessageJson.answers : [];
        currentPlayerId = lastMessageJson.currentPlayerId ? lastMessageJson.currentPlayerId : "";
        remainingIcons = lastMessageJson.remainingIcons ? lastMessageJson.remainingIcons : [];
    }

    const guessOrAnswer = () => {
        if (guessing) {
            return <Guess sendJsonMessage={sendJsonMessage} players={players} answers={answers} playerId={playerId} prompt={prompt} currentPlayerId={currentPlayerId}/>
        } else if (round === -1) {
            return <Lobby sendJsonMessage={sendJsonMessage} isHost={hostId===playerId} remainingIcons={remainingIcons}/>
        }   else {
            return <Answer sendJsonMessage={sendJsonMessage} prompt={prompt} players={players}/>
        }
    }
    
    return (
        <div className="h-[calc(100vh-150px)]">
            <div className='grid grid-cols-4 gap-4 h-full hidden sm:grid'>
                <div className='bg-light-purple pb-4 pr-4'>
                    <h3 className='p-4'>Players</h3>
                    {players.map((player:Player) => (
                        <h4 key={player.id}>
                            <div className="bg-white rounded-r-lg mt-2 p-1">{player.name} : {player.points}</div>
                            <PlayerIcon iconName={player.icon}/>
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
                        <h4 key={player.id}>
                            <div className="bg-white rounded-r-lg mt-2 p-1">{player.name} : {player.points}</div> 
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
