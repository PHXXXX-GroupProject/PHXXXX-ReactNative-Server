import { Server } from "./lib/app";

Server.connectToDatabase().catch(err => {
    console.log({
        component: "Database Driver",
        status: false,
        error: err.message
    });
});

Server.start();