"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocketClient() {
  if (socket) {
    return socket;
  }

  socket = io(process.env.NEXT_PUBLIC_API_WS_URL ?? "http://localhost:4000", {
    path: "/socket.io",
    autoConnect: true,
    transports: ["websocket"],
    withCredentials: true,
  });

  return socket;
}
