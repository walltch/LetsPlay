import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import Puissance4 from "../components/puissance4.jsx/PuissanceGame";

export default function LetsPlay({ socket }) {
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [secondUser, setSecondUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [waiting, setWaiting] = useState('');

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        socket.on("myConnexion", (pseudo, room) => {
          setPseudo(pseudo);
          setRoom(room);
          setLoading(false);
          if (!pseudo || !room) {
            navigate("/");
          }
        });
      };
      socket.on("connect", handleConnect);
      if (socket.connected) {
        handleConnect();
      }

      socket.on("newUser", (socketid, pseudo) => {
        setSecondUser(pseudo + "  " + "viens de rejoindre la salle");
      });

      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on("waiting", (room) => {
        setWaiting("En attente d'un autre joueur pour commencer la partie.");
      });

      return () => {
        socket.off("connect", handleConnect);
        socket.off("myConnexion");
        socket.off("newUser");
        socket.off("message");
        socket.off("waiting");
      };
    } else {
      console.log("Socket is not defined");
    }
  }, [socket, navigate]);

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (!pseudo || !room) {
        navigate("/");
      }
    }, 1000);

    return () => clearTimeout(redirectTimeout);
  }, [pseudo, room, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message && socket) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "me", message },
      ]);
      socket.emit("sendMessage", message, room);
      e.target.message.value = "";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-2/3 bg-black">
        <h1 className="color-white text-white text-center my-5">Room ID: {room}</h1>
        <Puissance4 socket={socket} room={room} />
      </div>
      <div className="flex flex-col w-1/3 h-full p-10 justify-between">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <span className="absolute text-green-500 right-0 bottom-0">
                <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                </svg>
              </span>
              <Avatar src="/broken-image.jpg" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg text-gray-600">{pseudo}</span>
              <span className="text-lg text-gray-600">#{socket.id}</span>
            </div>
          </div>
        </div>
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          <span className="text-sm text-gray-600 text-center">
            Vous avez rejoint la salle.
          </span>
          <span className="text-sm text-gray-600 text-center">
            {waiting}
          </span>
          <span className="text-sm text-gray-600 text-center">
            {secondUser}
          </span>
          {messages.map(({ sender, message }, index) => (
            <div
              key={index}
              className={`chat-message flex items-end ${
                sender === "me" ? "justify-end" : ""
              }`}
            >
              {sender === "me" ? (
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                  <div>
                    <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                      {message}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                  <div>
                    <span
                      className={`px-4 py-2 rounded-lg inline-block ${
                        sender !== "me"
                          ? "rounded-bl-none bg-gray-300 text-gray-600"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {message}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <form className="relative flex" onSubmit={handleSubmit}>
            <input
              name="message"
              id="message"
              type="text"
              placeholder="Enter your message"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span className="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
