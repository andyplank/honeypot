import { Player } from './Player';
import PlayerIcon from './PlayerIcon';
import AnswerInput from './AnswerInput';

const Answer = ({sendJsonMessage, prompt, players, playerId}: {sendJsonMessage: any, prompt: string, players: Player[], playerId:string}) => {
        
    const hasAnswered = players.find((player:Player) => player.id === playerId)?.hasAnswered || false;

    return (
        <div className="p-4">
            <div className="container p-6 md:p-10 shadow-xl rounded-2xl">
                <div className='pb-4'>
                    <h3 className='pb-20'>{prompt}</h3>
                    <AnswerInput sendJsonMessage={sendJsonMessage} hasAnswered={hasAnswered}/>
                </div>
            </div>
            <div>
                <h4 className='pt-10'>Waiting on...</h4>
                <div className='grid grid-cols-7 md:grid-cols-10 md:gap-4'>
                {players.filter((player:Player) => player.hasAnswered === false).map((player:Player) => (
                    <h4 key={player.id + '-wait-icon'}>
                        <PlayerIcon iconName={player.icon} />
                    </h4>
                ))}
                </div>

            </div>
        </div>
    )
}

export default Answer;