import * as http from "http";
import * as express from "express";
//@ts-ignore
import * as socketIo from "socket.io";

export class Server {
    private static readonly appPort = 8080;
    static readonly express = express();
    static readonly app = http.createServer(Server.express);
    static readonly io = socketIo(Server.app);

    static start() {
        Server.app.listen({ port: Server.appPort });

        console.log({
            component: "Server",
            status: true,
            port: Server.appPort,
            cwd: __dirname
        });
    }
}