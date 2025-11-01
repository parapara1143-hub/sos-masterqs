"use client";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL, SOCKET_PATH } from "./constants";
import { getAccessToken } from "./auth";
let socket:Socket|null=null;
export function getSocket(){
  if(socket) return socket;
  const token = getAccessToken();
  socket = io(SOCKET_URL, { path: SOCKET_PATH, transports:["websocket"], auth: token? { token } : undefined });
  return socket;
}
