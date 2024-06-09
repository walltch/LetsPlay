import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputFormSignIn from "./InputFormSignIn";

export default function FormSignIn({ socket }) {
  const [pseudo, setPseudo] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        socket.emit("connection", socket.id);
      };

      socket.on("connect", handleConnect);

      if (socket.connected) {
        handleConnect();
      }

      return () => {
        socket.off("connect", handleConnect);
      };
    } else {
      console.log("Socket is not defined");
    }
  }, [socket, pseudo, room]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const pseudoValue = data.get("pseudo");
    const roomValue = data.get("room");
    setPseudo(pseudoValue);
    setRoom(roomValue);

    if (socket) {

      socket.emit("loginDetails", { pseudo: pseudoValue, room: roomValue});
    }
    navigate(`/letsplay`);
  };  

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Bienvenue sur LetsPlay
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
            <InputFormSignIn name="pseudo" placeholder="Entrez votre pseudo" />
            <InputFormSignIn name="room" placeholder="Entrez l'identifiant de la salle" />
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
