import ActivityItem from "./ActivityItem";
import InteractionItem from "./InteractionItem";
import * as activityData from "./data/activity";
import CommandWidget from "./CommandWidget";
import { useState } from "react";
import globalCommand from "./store/command.ts";

export default function ActivityPage() {
  const [activityItems, setActivityItems] = useState([]);
  const [interactions, setInteractions] = useState([]);

  globalCommand.showActivity = () => {
    setActivityItems([
      {
        name: "发起好友请求与响应",
        description:
          "用户向其他用户发起好友请求，其他好友可以同意或者拒绝，同时用户也可以自己取消。",
        activity: activityData,
      },
    ]);

    setInteractions([
      {
        name: "用户获取好友请求",
        description: "用户可以用户所有好友请求",
        interaction: {
          role: "User",
          action: "get",
          payload: "NewFriendRequests",
        },
      },
      {
        name: "用户获取好友",
        description: "用户可以获取所有好友",
        interaction: {
          role: "User",
          action: "get",
          payload: "AllFriends",
        },
      },
    ]);
  };

  return (
    <div className="p-6 pb-24">
      <ul role="list" className="space-y-4">
        {activityItems.map((item) => (
          <li className="overflow-hidden rounded-md bg-white px-6 py-4 shadow">
            <ActivityItem {...item} />
          </li>
        ))}
        {interactions.map((item) => (
          <li className="overflow-hidden rounded-md bg-white px-6 py-4 shadow">
            <InteractionItem {...item} />
          </li>
        ))}
      </ul>

      <CommandWidget />
    </div>
  );
}
