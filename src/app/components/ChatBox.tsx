"use client"; 
// runs in the browser (we need typing + clicks)

import { useState } from "react"; 
// useState lets us remember what the user typed

export default function ChatBox({
  onSend,
}: {
  onSend?: (msg: string) => void; // parent can pass a function to handle messages
}) {
  const [msg, setMsg] = useState(""); 
  // msg = current text, setMsg = function to update it

  function send() {
    const text = msg.trim();      // remove extra spaces
    if (!text) return;            // do nothing if empty
    onSend?.(text);               // call parent callback if provided
    setMsg("");                   // clear input after sending
  }

  return (
    <div className="mt-6 max-w-xl">
      <div className="rounded-2xl border bg-white p-3 flex gap-2">
        <input
          value={msg}                           // controlled input value
          onChange={(e) => setMsg(e.target.value)} // update state as you type
          onKeyDown={(e) => e.key === "Enter" && send()} // Enter to send
          className="flex-1 outline-none"
          placeholder="say something to your avatar…"
        />
        <button onClick={send} className="px-3 py-1 rounded-lg bg-black text-white">
          Send
        </button>
      </div>
    </div>
  );
}
