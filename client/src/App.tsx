import { useEffect, useState } from 'react';
import Join from './components/Join';
import useWebSocket from 'react-use-websocket';

export default function App() {
	const WS_URL = 'ws://localhost:8000';
	const [messageHistory, setMessageHistory] = useState([]);
	
	// create a context for the WebSocket connection
    const { lastMessage, readyState, sendJsonMessage } = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        }
    });

	useEffect(() => {
	  if (lastMessage !== null) {
		setMessageHistory((prev) => prev.concat(lastMessage));
	  }
	}, [lastMessage, setMessageHistory]);

	return (
		<div className="App">
			{/* pass the lastMessage props to the join component */}
			<Join lastMessage={lastMessage} readyState={readyState} sendJsonMessage={sendJsonMessage} />
		</div>
  	);
}