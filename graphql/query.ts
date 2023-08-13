import * as fs from "fs";

import { Promise as NodeID3 } from "node-id3";

import { Playlist, Query, Scalars } from "./type";
import { MUSIC_DIR, PLAYLISTS_FILE, TRACK_DB_FILE, WATCH_DIRS } from "../lib/const";
import { OperatingSystems } from "../lib/enum";

export const resolver = {
    GetRegistry: async (params: any, req: any, query: any): Promise<Query["GetRegistry"]> => {
        const trackDb = JSON.parse(fs.readFileSync(TRACK_DB_FILE, "UTF-8")) as Scalars["TrackDb"];
        const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, "UTF-8")) as Playlist[];

        if (process.platform === OperatingSystems.ANDROID) {
            return {
                trackDb: trackDb, playlists
            };
        } else {
            //Extract refs from playlists.json to an efficiently referable map of the following type
            // {
            //     "English Audios": ["New Divide.mp3", "Battle Cry.mp3", ...]
            // }
            const playlistRefDb = new Map<string, Set<string>>();
            for (const playlist of playlists) {
                for (const ref of playlist.refs) {
                    const [dir, name] = ref.split("/");
                    if (!playlistRefDb.has(dir)) {
                        playlistRefDb.set(dir, new Set());
                    }
                    playlistRefDb.get(dir)!.add(name);
                }
            }

            //Create another TrackDb for mutation purposes
            const trackDbClone = JSON.parse(fs.readFileSync(TRACK_DB_FILE, "UTF-8")) as Scalars["TrackDb"];

            const autoPlaylist: Playlist = {
                title: "Auto Playlist",
                color: "0",
                temporary: true,
                refs: []
            }

            //Iterate over all music files
            for (const dir of WATCH_DIRS) {
                const playlistRefsSet = playlistRefDb.get(dir)!;
                const trackNames = fs.readdirSync(`${MUSIC_DIR}/${dir}`);

                for (const trackName of trackNames) {
                    if (trackDbClone[dir][trackName]) {
                        //CASE: Track is already in trackDb.json
                        if (!playlistRefsSet.has(trackName)) {
                            //CASE: Track is not in playlists.json
                            //Add an entry in autoPlaylist
                            autoPlaylist.refs.push(`${dir}/${trackName}`);
                        }
                        //Remove already iterated track from trackRefDb
                        delete trackDbClone[dir][trackName];
                    } else {
                        //CASE: Track is not in tracks.json and playlists.json
                        //Read its id3 tag
                        const trackPath = `${MUSIC_DIR}/${dir}/${trackName}`;
                        const trackTag = await NodeID3.read(trackPath);
                        
                        //Add an entry in tracks
                        trackDb[dir][trackName] = {
                            path: `${dir}/${trackName}`,
                            artist: trackTag.artist ? trackTag.artist : "",
                            title: trackTag.title ? trackTag.title : "",
                            album: trackTag.album ? trackTag.album : "",
                            band: trackTag.performerInfo ? trackTag.performerInfo : ""
                        };
                        
                        //Add an entry in autoPlaylist
                        autoPlaylist.refs.push(`${dir}/${trackName}`);
                    }
                }
            }

            //Add the autoPlaylist to playlists if it is non-empty
            if (autoPlaylist.refs.length > 0) {
                playlists.push(autoPlaylist);
            }

            return {
                trackDb: trackDb, playlists
            }
        }
    }
};