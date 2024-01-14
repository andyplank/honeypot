import { Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Player } from "./Player";
import PlayerIcon from "./PlayerIcon";

const EndGame = ({sendJsonMessage, players, isHost}: {sendJsonMessage: any, players: Player[], isHost: boolean}) => {
    const [isShowing, setIsShowing] = useState(false);
    const winner = players.reduce((prev, curr) => prev.points > curr.points ? prev : curr);

    const playAgain = () => {
        sendJsonMessage({
            "type": "play_again",
        });
    };

    useEffect(() => {
        setTimeout(() => {
            setIsShowing(true);
        }, 1000);   
    }, []);

    const newGameBtn = () => {
        if (isHost) {
            return (
                <div className='text-center pt-10'>
                    <button className='button-orange hover:scale-110 duration-500 p-2 pr-8 pl-8' onClick={playAgain}><h3>Play again?</h3></button>
                </div>
            )
        } else {
            return (
                <div className='text-center pt-10'>
                    <h4>Waiting for host to start a new game...</h4>
                </div>
            )
        }
    }

    return (
        <div className="text-center">
            <h1>And the winner is...</h1>
            <Transition
                as={Fragment}
                show={isShowing}
                enter="transform transition duration-[400ms]"
                enterFrom="scale-0"
                enterTo="scale-100"
            >
                <div className="flex justify-center">
                    <PlayerIcon iconName={winner.icon} customClass="max-h-40 md:max-h-80"/>
                </div>
            </Transition>

            <div>
                <Transition
                    as={Fragment}
                    show={isShowing}
                    enter="transform transition duration-[750ms] delay-[1200ms]"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                >
                    <h2 className="pt-4">Thanks for playing!</h2>
                </Transition>
                <Transition
                    as={Fragment}
                    show={isShowing}
                    enter="transform transition duration-[750ms] delay-[1800ms]"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                >
                    <div>
                    {newGameBtn()}
                    </div>
                </Transition>
            </div>
        </div>
    );
}

export default EndGame;