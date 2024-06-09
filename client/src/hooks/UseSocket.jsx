import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
  const url = 'http://localhost:4000';
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketIo = io(url);

    socketIo.on('connect', () => {
      setSocket(socketIo);
      setIsConnected(true);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return { socket, isConnected };
};

export default useSocket;
