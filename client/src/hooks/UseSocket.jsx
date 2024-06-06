import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (url) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketIo = io(url);

        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        };
    }, [url]);

    return socket;
};

export default useSocket;
