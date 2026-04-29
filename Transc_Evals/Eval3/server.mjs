import http from "node:http";
import next from "next";
import { Server } from "socket.io";
import { registerChessNamespace, registerMatchmakingNamespace } from "./socket-handlers/chess.mjs";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname: "0.0.0.0", port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const httpServer = http.createServer((req, res) => handle(req, res));

    const io = new Server(httpServer, {
      transports: ["websocket", "polling"],
      cors: {
        origin: true,
        credentials: true,
      },
    });

    registerChessNamespace(io);
    registerMatchmakingNamespace(io);

    const gracefulShutdown = () => {
      io.close(() => {
        httpServer.close(() => process.exit(0));
      });

      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);

    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`> Internal app server ready on https://0.0.0.0:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
