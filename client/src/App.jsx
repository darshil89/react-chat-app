import { useEffect, useMemo, useState } from "react";

import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("joinRoom", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("received", (data) => {
      setMessages((oldMessages) => [...oldMessages, data]);
    });
  }, []);

  return (
    <div>
      <h2>Chat App</h2>

      {messages.map((message, index) => {
        return <div key={index}>{message}</div>;
      })}
      <div>{socketId}</div>
      <form onSubmit={joinRoomHandler}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
        />
        <button type="submit">Send</button>
      </form>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
