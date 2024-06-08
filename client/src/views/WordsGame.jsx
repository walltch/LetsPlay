import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import useSocket from "./hooks/UseSocket";

export default function WordsGame() {
  const socket = useSocket();
  const [socketid, setSocketId] = useState("");
  const [connectedUser, setConnectedUser] = useState("");
  const [newUserConnections, setNewUserConnections] = useState([]);
  const [myMessages, setMyMessages] = useState("");
  const [userMessages, setUserMessages] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setSocketId(socket.id);
        setConnectedUser("Vous venez de rejoindre le chat");
        socket.emit("newUser", socket.id);
      });
      socket.on("disconnect", () => {});
      socket.on("newUserConnected", (socketid) => {
        console.log("new user connected", socketid);
        setNewUserConnections((prevNewUserConnections) => [
          ...prevNewUserConnections,
          socketid,
        ]);
      });

      socket.on("message", (msg, socketid) => {
        setMyMessages(msg);
        setUserMessages(socketid);
      });

      socket.on("usersMessages", (msg, socketid) => {
        // Handle usersMessages event if needed
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("newUserConnected");
      };
    }
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const message = formData.get("message");
    setMyMessages(message);
    e.target.reset();
   socket.emit("room", "room", message, socketid);
  };

  return (
    <div className="flex h-screen">
      <div className="flex w-2/3"></div>
      <div className="flex flex-col w-1/3 h-full py-10 justify-between">
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
              <span className="text-lg text-gray-600">#{socketid}</span>
            </div>
          </div>
        </div>
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          <span className="text-sm text-gray-600 text-center">
            {connectedUser}
          </span>
          {newUserConnections.map((user, index) => (
            <span key={index} className="text-sm text-gray-600 text-center">
              Nouvel utilisateur connecté : {user}
            </span>
          ))}
          <div className="chat-message">
            <div className="flex items-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div>
                  <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                    Can be verified on any platform using docker
                  </span>
                </div>
              </div>
              <Avatar src="/broken-image.jpg" />
            </div>
          </div>
          <div className="chat-message">
            <div className="flex items-end justify-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div>
                  <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                    Your error message says permission denied, npm global
                    installs must be given root privileges.
                  </span>
                </div>
              </div>
              <Avatar src="/broken-image.jpg" />
            </div>
          </div>
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <form className="relative flex" onSubmit={handleSubmit}>
            <input
              name="message"
              id="message"
              type="text"
              placeholder="Entrez votre message"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            ></input>
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span className="font-bold">Envoyer</span>
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
