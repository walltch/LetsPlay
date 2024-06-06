import React, { useEffect, useState } from 'react';
import useSocket from './hooks/UseSocket';

const SERVER_URL = 'http://localhost:3000';

function App() {
    const socket = useSocket(SERVER_URL);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                setUserId(socket.id);
                socket.emit('newUser', socket.id);
            });

            socket.on('newUserConnected', (socketid) => {
                console.log(`Nouvel utilisateur connecté : ${socketid}`);
            });

            socket.on('message', (msg, socketid) => {
                setMessages((prevMessages) => [...prevMessages, { msg, socketid }]);
            });

            socket.on('join', (room, socketid) => {
                console.log(`L'utilisateur ${socketid} a rejoint la room : ${room}`);
            });

            socket.on('userJoined', (room, socketid) => {
                console.log(`L'utilisateur ${socketid} a rejoint la room : ${room}`);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        }
    }, [socket]);

    const handleSendMessage = () => {
        if (socket) {
            socket.emit('room', room, message, socket.id);
            setMessage('');
        }
    };

    const handleChangeRoom = (e) => {
        const newRoom = e.target.value;
        if (socket && newRoom !== room) {
            socket.emit('leave', room);
            socket.emit('join', newRoom);
            setRoom(newRoom);
        }
    };

    return (
        <div>
            <h1>Scrabble Game</h1>
            <div>
                <p>Mon id : {userId}</p>
                <input
                    type="text"
                    value={room}
                    onChange={handleChangeRoom}
                    placeholder="Enter room"
                />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            <div>
                <h2>Messages</h2>
                {messages.map((m, index) => (
                    <p key={index}>
                        {m.socketid}: {m.msg}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default App;
