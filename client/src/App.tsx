import { useEffect, useState } from 'react';
import Game from './components/Game';
import useWebSocket from 'react-use-websocket';
import Join from './components/Join';
import './App.css'
import Header from './components/Header';
import registerServiceWorker from './components/ServiceWorker';

export default function App() {
	const WS_URL = process.env.REACT_APP_API_URL;
	useEffect(() => {
		registerServiceWorker();
	}, []);

	// const [messageHistory, setMessageHistory] = useState<any>([]);
    const [roomCode, setRoomCode] = useState('');
    const {lastMessage, sendJsonMessage} = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        }
    });

	const sendJsonToServer = (json:any) => {
		const copy = JSON.parse(JSON.stringify(json));
		copy.room_code = roomCode;
		sendJsonMessage(copy);
	}

	let json:any = null;
	if (lastMessage !== null) {
		json = JSON.parse(lastMessage.data)
		if (roomCode === "" && json !== null && json.room_code !== undefined && json.room_code !== roomCode) {
			setRoomCode(json.room_code);
		}
	}

	// useEffect(() => {
	//   if (lastMessage !== null) {
	// 	setMessageHistory((prev:any) => prev.concat(lastMessage));
	//   }
	// }, [lastMessage, setMessageHistory]);


	const view = () => {
		if (json === null || json.round === undefined) {
			return <Join sendJsonMessage={sendJsonToServer} roomCode={roomCode} setRoomCode={setRoomCode} />
		} else {
			return <Game sendJsonMessage={sendJsonToServer} lastMessageJson={json} />
		}
	
	}

	return (
		<div className="App h-screen">
			<Header roomCode={roomCode} />

			{view()}

			{/* <div>
				<h3>Message History</h3>
				{messageHistory.map((message:any, idx:number) => (
					<div key={idx}>{message.data}</div>
				))}
			</div> */}


			{/* <div className='bg-black pt-10'>
				<h4>Debugging</h4>
				<div>
				<p>WebSocket Status: {ReadyState[readyState]}</p>
				<p>Last Message: {lastMessage && lastMessage.data}</p>
				{roomCode && <p>Room Code: {roomCode}</p>}
			</div> 
			</div>*/}
		</div>
  	);
}