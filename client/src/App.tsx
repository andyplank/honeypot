import { useEffect, useState } from 'react';
import Game from './components/Game';
import useWebSocket from 'react-use-websocket';
import Join from './components/Join';
import './App.css'
import Header from './components/Header';
import registerServiceWorker from './components/ServiceWorker';

export default function App() {
	const WS_URL = process.env.REACT_APP_API_URL || 'ws://localhost:8000';
	useEffect(() => {
		console.log("app mount");
		registerServiceWorker();
	}, []);
	console.log("app render");

    const [roomCode, setRoomCode] = useState('');
	const [playerId, setPlayerId] = useState('');
    const {lastMessage, sendJsonMessage} = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
			if (roomCode !== "" && playerId !== "") {
				const json = {
					"type": "rejoin",
					player_id: playerId
				}
				sendJsonMessage(json);
			}
        }
    });

	const sendJsonToServer = (json:any) => {
		let copy:any = {};
		try{
			copy = JSON.parse(JSON.stringify(json));
			copy.room_code = roomCode;
		} catch (e) {
			console.log(e);
			return;
		}
		sendJsonMessage(copy);
	}

	let json:any = null;
	if (lastMessage !== null) {
		json = JSON.parse(lastMessage.data)
		if (roomCode === "" && json !== null && json.room_code !== undefined && json.room_code !== roomCode) {
			setRoomCode(json.room_code);
		}
		if (json.playerId !== undefined && json.playerId !== playerId) {
			setPlayerId(json.playerId);
		}
	}

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
		</div>
  	);
}