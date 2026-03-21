import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.emit("system:connected", { connectedAt: Date.now() });
  }

  handleDisconnect() {
    // no-op for now
  }

  @SubscribeMessage("battle:join")
  handleBattleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { battleId: string }) {
    client.join(`battle:${data.battleId}`);
    client.emit("battle:joined", {
      battleId: data.battleId,
      joinedAt: Date.now(),
    });
  }

  emitToBattleRoom(battleId: string, event: string, payload: unknown) {
    this.server.to(`battle:${battleId}`).emit(event, payload);
  }
}
