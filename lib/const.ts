import * as fs from "fs";
import * as path from "path";

import * as gql from "graphql";

import { Architecture, MusicDir, OperatingSystems } from "./enum";

export let MUSIC_DIR: string;
if (process.platform === OperatingSystems.ANDROID) {
    MUSIC_DIR = MusicDir.TITAN;
} else if (process.platform === OperatingSystems.LINUX && process.arch === Architecture.ARM) {
    MUSIC_DIR = MusicDir.PI;
} else if (process.platform === OperatingSystems.LINUX) {
    MUSIC_DIR = MusicDir.REGULOUS;
} else if (process.platform === OperatingSystems.WINDOWS) {
    MUSIC_DIR = MusicDir.AUTONOE;
} else {
    MUSIC_DIR = "";
}

export const WATCH_DIRS = [
    "Sinhala Audios",
    "Sinhala Hymns",
    "English Audios",
    "English Hymns",
    "Hindi Audios",
    "Exceptions",
    "Music Catalog"
];

export const TRACK_DB_FILE = `${MUSIC_DIR}/Registries/trackDb.json`;
export const PLAYLISTS_FILE = `${MUSIC_DIR}/Registries/playlists.json`;

export const SCHEMA = gql.buildSchema(fs.readFileSync(path.resolve(__dirname + "/../graphql/schema.graphql"), "utf-8"))