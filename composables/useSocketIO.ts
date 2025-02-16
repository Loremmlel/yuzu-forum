import type {Socket} from "socket.io-client";
import {io} from 'socket.io-client'

let socket: Socket | null = null

export function useSocketIO() {
    if (!socket) {
        socket = io()
    }
    return socket
}