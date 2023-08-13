import { Server } from "./lib/app";
import { router } from "./lib/router";

//Bind routers
Server.express.use("/musix", router);

Server.start();