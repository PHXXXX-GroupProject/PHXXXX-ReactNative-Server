import * as fs from "fs";
import * as path from "path";

import * as express from "express";
import * as archiver from "archiver";
import { graphqlHTTP } from "express-graphql";

import { resolver as Query } from "../graphql/query";
import { resolver as Mutation } from "../graphql/mutation";
import { MUSIC_DIR, SCHEMA } from "./const";
import { Playlist } from "../graphql/type";

export const router = express.Router();

router.use("/audios", express.static(MUSIC_DIR));

router.use("/graphql", express.json({ limit: "1MB" }), graphqlHTTP((req: any) => ({
    schema: SCHEMA,
    rootValue: {
        ...Query, ...Mutation
    },
    context: req.session,
    graphiql: true,
})));

router.route("/playlists/:playlistName")
    .get((req, res) => {
        const playlistTitle = req.params.playlistName as string;
        const playlists = JSON.parse(fs.readFileSync(`${MUSIC_DIR}/Registries/playlists.json`, "UTF-8")) as Playlist[];

        const playlist = playlists.find(playlist => playlist.title === playlistTitle);
        if (playlist) {
            //Setup response
            res.on("close", () => {
                res.end();
            });

            //Setup archive
            const archive = archiver("zip", { store: true });

            archive.on("error", (error) => {
                console.log(error);
                res.json({
                    status: false,
                    serverError: {
                        message: "An error occurred while archiving the playlist"
                    }
                });
            });

            for (const ref of playlist.refs) {
                archive.file(`${MUSIC_DIR}/${ref}`, {
                    name: ref.slice(ref.lastIndexOf("/") + 1)
                });
            }

            res.attachment(`${playlist.title}.zip`).type("zip");
            archive.pipe(res);
            archive.finalize();
        } else {
            res.json({
                status: false,
                serverError: {
                    message: "There is no playlist at the specified index"
                }
            });
        }
    });

router.route("/tracks/:path/")
    .get((req, res) => {
        const trackPath = req.params.path as string;
        res.download(`${MUSIC_DIR}/${trackPath}`);
    });

router.use("/", express.static(__dirname + "/../../../frontends/musix"));

router.route("/")
    .get((req, res) => {
        res.sendFile(path.resolve(__dirname + "/../../../frontends/musix/index.html"));
    });