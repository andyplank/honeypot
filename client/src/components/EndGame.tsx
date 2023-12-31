import { Player } from "./Player";
import PlayerIcon from "./PlayerIcon";

const EndGame = ({sendJsonMessage, players, isHost}: {sendJsonMessage: any, players: Player[], isHost: boolean}) => {
    const winner = players.reduce((prev, curr) => prev.points > curr.points ? prev : curr);

    const playAgain = () => {
        sendJsonMessage({
            "type": "play_again",
        });
    };

    const newGameBtn = () => {
        if (isHost) {
            return (
                <div className='text-center pt-20'>
                    <button className='button-orange hover:scale-110 duration-500 p-2 pr-8 pl-8' onClick={playAgain}><h3>Play again?</h3></button>
                </div>
            )
        } else {
            return (
                <div className='text-center pt-20'>
                    <h4>Waiting for host to start a new game...</h4>
                </div>
            )
        }
    }

    return (
        <div className="text-center">
            <h1>And the winner is...</h1>
                <div className="flex justify-center">
                    <PlayerIcon iconName={winner.icon} customClass="max-h-40 md:max-h-80"/>
                </div>
                <h2 className="pt-4">Thanks for playing!</h2>
            {newGameBtn()}
        </div>
    );
}

export default EndGame;