// Desc: Browser channel utility functions
import { Message } from "@/types/localTypes";

const CHANNEL_NAME = "tokenPay";

export const broadcastMessage = (message: Message) => {
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage(message);
  channel.close();
};

export const listenForMessages = (callback: any) => {
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = (event) => {
    callback(event.data);
  };

  return () => channel.close();
};
