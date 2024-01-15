import { useEffect, useState } from 'react';
import Game from './components/Game';
import useWebSocket from 'react-use-websocket';
import Join from './components/Join';
import './App.css'
import Header from './components/Header';
import Loader from './components/Loader';

const cacheImages = async (srcArray: string[]) => {
	const promises = await srcArray.map((src) => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = src;
			img.onload = resolve;
			img.onerror = reject;
		});
	}
	);
	await Promise.all(promises);
}

export default function App() {
	const WS_URL = process.env.REACT_APP_API_URL || 'ws://localhost:8000';
	useEffect(() => {
		const imgs = [
			"./icons/bear.svg",
			"./icons/chicken.svg",
			"./icons/cat.svg",
			"./icons/dog.svg",
			"./icons/fox.svg",
			"./icons/lion.svg",
			"./icons/mouse.svg",
			"./icons/panda.svg",
			"./icons/snake.svg",
			"./icons/tiger.svg",
			"./icons/horse.svg",
			"./icons/pig.svg",
			"./icons/sheep.svg",
			"./icons/cow.svg",
			"./icons/monkey.svg",
		];
		cacheImages(imgs);
	}, []);
	console.log("app render");

    const [roomCode, setRoomCode] = useState('');
	const [playerId, setPlayerId] = useState('');
    const {lastMessage, sendJsonMessage} = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
			if (roomCode !== undefined && playerId !== undefined && roomCode !== "" && playerId !== "") {
				reconnect();
			}
        },
		// TODO: add animation for reconnecting
		shouldReconnect: (event) => {
			console.log(`WebSocket closed with code ${event.code}`);
			return true;
		},
    });

	const reconnect = () => {
		const json = {
			"type": "rejoin",
			playerId: playerId
		}
		sendJsonToServer(json);
	}

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
		<div className="App h-dvh md:h-screen flex-col flex">
			<Header roomCode={roomCode} />
			{view()}
			<Loader />
		</div>
  	);
}