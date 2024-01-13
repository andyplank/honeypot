import Answer from "./Answer";
import EndGame from "./EndGame";
import Guess from "./Guess";
import Lobby from "./Lobby";
import Notification from "./Notification";
import { Player } from "./Player";
import PlayerIcon from "./PlayerIcon";
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Game = ({sendJsonMessage, lastMessageJson}: {sendJsonMessage: any, lastMessageJson: any}) => {

    let round:number = -1;
    let players:Player[] = [];
    let guessing:boolean = false;
    let hostId:string = "";
    let playerId:string = "myId";
    let prompt:string = "";
    let answers:string[] = [];
    let currentPlayerId:string = "";
    let remainingIcons:string[] = [];
    let textToDisplay:string = "";
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
        textToDisplay = lastMessageJson.text ? lastMessageJson.text: "";
        players.sort((a:Player, b:Player) => b.points - a.points);
    }

    const guessOrAnswer = () => {
        if (guessing) {
            return <Guess sendJsonMessage={sendJsonMessage} players={players} answers={answers} playerId={playerId} prompt={prompt} currentPlayerId={currentPlayerId}/>
        } else if (round === -1) {
            return <Lobby sendJsonMessage={sendJsonMessage} isHost={hostId===playerId} remainingIcons={remainingIcons}/>
        } else if (round === -2) {
            return <EndGame sendJsonMessage={sendJsonMessage} players={players} isHost={hostId===playerId} />
        } else {
            return <Answer sendJsonMessage={sendJsonMessage} prompt={prompt} players={players} playerId={playerId}/>
        }
    }

    return (

        <div className="grow">

            {/* Desktop */}
            <div className='grid grid-cols-4 gap-4 h-full hidden sm:grid'>
                <div className='bg-light-purple pb-4 pr-4'>
                    <h3 className='p-4'>Players</h3>
                    {players.map((player:Player) => (
                        <div key={player.id} className="flex bg-white rounded-r-lg mt-2 p-1 h-12 justify-between items-center">
                            <h4>{player.name} : {player.points}</h4>
                            <div className="test">
                                <PlayerIcon iconName={player.icon} customClass="h-12"/>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='col-span-3'>
                    <div className='p-4'>
                        {guessOrAnswer()}
                    </div>
                </div>
            </div>  

            {/* Mobile */}
            <div className='sm:hidden'>
                <div className='bg-light-purple'>
                    <Disclosure>
                        {({ open }) => (
                            <>
                            <div className="flex justify-between items-center">
                                <div className="flex justify-start"> 
                                    <h3 className='p-2'>Players</h3>
                                </div>
                                <div className="justify-end">
                                <Disclosure.Button className="rounded p-2 ">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-7 w-7" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                                </div>
                            </div>
                            <Disclosure.Panel className="p-2">
                                <div>
                                    {players.map((player) => (
                                        <div key={player.id} className="flex bg-white rounded mt-2 p-1 h-12 justify-between items-center">
                                            <h4>{player.name} : {player.points}</h4>
                                            <div className="">
                                                <PlayerIcon iconName={player.icon} customClass="h-12"/>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Disclosure.Panel>
                            </>
                            )}
                    </Disclosure>
                </div>
                <div className='pt-4 px-4'>
                    {guessOrAnswer()}
                </div>
            </div>   

            <Notification text={textToDisplay}/>            

        </div>
    )
}

export default Game;
