// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');

// const WordsGame = () => {
//   const [room, setRoom] = useState('');
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [socketId, setSocketId] = useState('');

//   useEffect(() => {
//     socket.on('connect', () => {
//       setSocketId(socket.id);
//       socket.emit('newUser', socket.id);
//     });

//     socket.on('newUserConnected', (newSocketId) => {
//       setMessages(prevMessages => [
//         ...prevMessages,
//         { type: 'newUser', text: `Nouvel utilisateur connecté : ${newSocketId}` }
//       ]);
//     });

//     socket.on('message', (msg, senderId) => {
//       setMessages(prevMessages => [
//         ...prevMessages,
//         { type: 'message', text: msg, sender: senderId }
//       ]);
//     });

//     socket.on('join', (room, joinedSocketId) => {
//       setMessages(prevMessages => [
//         ...prevMessages,
//         { type: 'join', text: `L'utilisateur ${joinedSocketId} a rejoint la room : ${room}` }
//       ]);
//     });

//     socket.on('userJoined', (room, joinedSocketId) => {
//       setMessages(prevMessages => [
//         ...prevMessages,
//         { type: 'userJoined', text: `L'utilisateur ${joinedSocketId} a rejoint la room : ${room}` }
//       ]);
//     });

//     return () => {
//       socket.off('connect');
//       socket.off('newUserConnected');
//       socket.off('message');
//       socket.off('join');
//       socket.off('userJoined');
//     };
//   }, []);

//   const handleRoomChange = (e) => {
//     const newRoom = e.target.value;
//     socket.emit('leave', room);
//     socket.emit('join', newRoom);
//     setRoom(newRoom);
//   };

//   const handleSendMessage = () => {
//     if (message && room) {
//       socket.emit('room', room, message, socketId);
//       setMessage('');
//     }
//   };

//   return (
//     <div>
//       <div id="profil">
//         <p>Mon id : {socketId}</p>
//       </div>
//       <div>
//         <input
//           type="text"
//           id="room"
//           value={room}
//           onChange={handleRoomChange}
//           placeholder="Enter room"
//         />
//       </div>
//       <div>
//         <input
//           type="text"
//           id="message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Enter message"
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//       <div id="messages">
//         {messages.map((msg, index) => (
//           <p key={index}>
//             {msg.type === 'message' ? `${msg.sender}: ${msg.text}` : msg.text}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WordsGame;

// }