import {
  PlayIcon,
  StopIcon,
  ArrowDownOnSquareStackIcon,
  CogIcon,
  Cog6ToothIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import globalCommand from "./store/command";
import ChatIcon from './assets/chat.svg';
import { nanoid } from 'nanoid'
import cache from './store/cache';

interface Props {
  moduleId?: string;
  className?: string;
  subject: string;
  action: string;
}
export default function ChatWidget(props: Props) {
  // 布局信息理论上应该由外部容器提供，给一个默认值
  const { moduleId, className = 'fixed lg:left-full-menu sm:left-mini-menu bottom-6', subject, action } = props;
  const [status, setStatus] = useState(0);
  const [message, setMessage] = useState("");

  const changeStatus = () => {
    if (status === 1) return;

    // debugger
    setStatus(1);

    const api = `${import.meta.env.VITE_API_HOST}/${subject}`;
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cache.chatId ?? nanoid(), moduleId, message }),
    })
      .then((res) => res.json())
      .then((res) => {
        const { id, data } = res;
        console.log(message, data);
        setStatus(0);
        globalCommand[action]?.(id, data);
        cache.chatId = id;
        setMessage("");
        document.querySelector("#chat")!.style.height = "32px";
      });
    // TEST
    // setTimeout(() => {
    //   setStatus(0);
    //   globalCommand[action]?.();
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
            value={message}
            onChange={(e) => {
              const { target } = e;
              setMessage(target.value);
              // 高度自适应
              target.style.height = "inherit";
              target.style.height = `${target.scrollHeight}px`;
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
    </div>
  );
}
