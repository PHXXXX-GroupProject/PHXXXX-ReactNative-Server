import * as fs from "fs";

import { Promise as NodeID3 } from "node-id3";

import { Mutation, MutationOverwriteRegistryArgs, MutationUpdateId3TagArgs } from "./type";
import { MUSIC_DIR, PLAYLISTS_FILE, TRACK_DB_FILE } from "../lib/const";

export const resolver = {
    OverwriteRegistry: async (params: MutationOverwriteRegistryArgs, req: any, query: any): Promise<Mutation["OverwriteRegistry"]> => {
        fs.writeFileSync(TRACK_DB_FILE, JSON.stringify(params.registry.trackDb));
        fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(params.registry.playlists));
        return true;
    },

    UpdateId3Tag: async (params: MutationUpdateId3TagArgs, req: any, query: any): Promise<Mutation["UpdateId3Tag"]> => {
        NodeID3.update(params.track,`${MUSIC_DIR}/${params.track.path}`);
        return true;
    }
};