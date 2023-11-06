import { useEffect, useState } from 'react';
import Lobby from './components/Lobby';
import Answer from './components/Answer';
import Guess from './components/Guess';
import useWebSocket, {ReadyState} from 'react-use-websocket';

export default function App() {
	const WS_URL = 'ws://localhost:8000';
	const [messageHistory, setMessageHistory] = useState<any>([]);
    const [roomCode, setRoomCode] = useState('');

	// create a context for the WebSocket connection
    const { lastMessage, readyState, sendJsonMessage } = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        }
    });

	let json:any = null;
	let players:string[]= [];
	let points:any = {};
	// parse lastMessage.data to get the roomCode
	if (lastMessage !== null) {
		console.log(lastMessage.data)
		json = JSON.parse(lastMessage.data)
		points = json.points;
		players = json.players;
	}

	if (roomCode === "" && json !== null && json.room_code !== undefined) {
		setRoomCode(json.room_code);
	}

	useEffect(() => {
	  if (lastMessage !== null) {
		setMessageHistory((prev:any) => prev.concat(lastMessage));
	  }
	}, [lastMessage, setMessageHistory]);

	return (
		<div className="App">
			<div>
				<p>WebSocket Status: {ReadyState[readyState]}</p>
				<p>Last Message: {lastMessage && lastMessage.data}</p>
				{roomCode && <p>Room Code: {roomCode}</p>}
			</div>


			<div>
				<h3>Players</h3>
				{players && players.map((player:string, idx:number) => (
					<div key={idx}>{player} : {points[player]}</div>
					
				))}
			</div>

			{/* pass the lastMessage props to the join component */}
			<Lobby lastMessage={lastMessage} readyState={readyState} sendJsonMessage={sendJsonMessage} roomCode={roomCode} setRoomCode={setRoomCode} />
			<Answer roomCode={roomCode} sendJsonMessage={sendJsonMessage}/>
			<Guess roomCode={roomCode} sendJsonMessage={sendJsonMessage}/>

			<div>
				<h3>Message History</h3>
				{messageHistory.map((message:any, idx:number) => (
					<div key={idx}>{message.data}</div>
				))}
			</div>
		</div>
  	);
}