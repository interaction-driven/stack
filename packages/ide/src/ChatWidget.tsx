import {
  PlayIcon,
  StopIcon,
  ArrowDownOnSquareStackIcon,
  CogIcon,
  Cog6ToothIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import globalCommand from "./store/command.ts";
import ChatIcon from './assets/chat.svg';
// import { useChat } from 'ai/react';

const api = `${import.meta.env.VITE_API_HOST}/module`

interface Props {
  className?: string;
}

const commandToCall = ["showModule", "showActivity", "showCode"];
export default function ChatWidget(props: Props) {
  const { className } = props;
  const [commandIndex, setCommandIndex] = useState(0);
  const [status, setStatus] = useState(0);
  const [inputValue, setInputValue] = useState("");
  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   api,
  //   headers: { "Content-Type": "application/json" },
  // });

  const changeStatus = () => {
    if (status === 1) return;

    // debugger
    setStatus(1);

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: inputValue }],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(inputValue, data);
        setStatus(0);
        setCommandIndex(commandIndex + 1);
        globalCommand[commandToCall[commandIndex]]?.(data);
        // setInputValue("");
        // document.querySelector("#chat")!.style.height = "32px";
      });
      // setTimeout(() => {
      //   setStatus(0);
      //   setCommandIndex(commandIndex + 1);
      //   globalCommand[commandToCall[commandIndex]]?.();
      // }, 1000)
  };

  return (
    <div className={`${className} z-50 p-6 w-chat box-content`}>
      {/* <div className="text-gray-chat p-2">
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div> */}
      {/* <form className="w-chat" onSubmit={handleSubmit}> */}
        <div className="rounded-xl bg-white shadow-chat border border-gray-bd2 w-chat p-2 flex items-end">
          <div className="w-full grow flex items-start">
            <div className="mx-3 mt-1">
              <ChatIcon />
            </div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <textarea
              id="chat"
              // value={input}
              value={inputValue}
              onChange={(e) => {
                const { target } = e;
                setInputValue(target.value);
                // 高度自适应
                target.style.height = "inherit";
                target.style.height = `${target.scrollHeight}px`;
                // handleInputChange(e);
              }}
              onKeyDown={(e) => {
                const { key } = e;
                if (key === "Enter" && e.metaKey) {
                  changeStatus();
                }
              }}
              name="command"
              className="w-full h-8 overflow-hidden border-0 py-1.5 px-1 text-gray-chat font-sans font-light placeholder:text-gray-ph placeholder:text-xs text-sm resize-none focus:ring-0 focus:outline-none"
              placeholder="Say something"
              autoComplete="false"
            />
          </div>
          <button
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-black-bg px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
            onClick={changeStatus}
            // type="submit"
          >
            {status === 0 ? (
              "Send"
            ) : (
              <CogIcon
                color={"slate"}
                className="-ml-0.5 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      {/* </form> */}
    </div>
  );
}
