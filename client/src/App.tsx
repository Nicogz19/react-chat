import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("/");

interface Messages {
  body: string;
  from: string;
}

const App = () => {

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Messages[]>([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newMessage = {
      body: message,
      from: "Yo"
    }

    setMessages([...messages, newMessage])
    socket.emit("message", message)
    setMessage("")
  }

  useEffect(() => {
    // evento que escucha el mensaje que llega del lado del servidor
    socket.on("message", receiveMessage)

    return () => {
      socket.off("message", receiveMessage)
    }
  }, [])

  const receiveMessage = (message: Messages) => {
    setMessages(state => [...state, message])
  }

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10 rounded-xl">
        <h1 className="text-2xl font-bold my-2 text-sky-500">React Chat</h1>
        <input
          className="border-2 border-zinc-500 p-2 w-full text-black"
          type="text"
          placeholder="Escribe tu mensaje"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <ul>
          {messages.map((message, i) => (
            <li
              key={i}
              className={`my-2 p-2 table text-sm rounded-md ${message.from === "Yo" ? "bg-sky-500" : "bg-fuchsia-800 ml-auto"}`}
            >
              <span className="text-xs text-slate-300 block">{message.from}</span>
              <span className="text-md">{message.body}</span>
            </li>
          ))}
        </ul>
      </form>


    </div>
  )
}

export default App