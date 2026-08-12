import { io, Socket } from "socket.io-client";

class DispatchSocketService {
  public socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io({ path: "/socket.io" });
      this.socket.on("connect", () => {
        console.log("[DispatchSocket] Connected:", this.socket?.id);
      });
    }
    return this.socket;
  }

  triggerIncident(payload: any) {
    this.socket?.emit("trigger_incident", payload);
  }
}

export const dispatchSocket = new DispatchSocketService();
