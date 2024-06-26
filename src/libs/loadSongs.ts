import type { Song } from "@/types";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const cache = new Map();
const cacheDir = "node_modules/.astro";
const cachePath = `${cacheDir}/songs.json`;

function getFromCache() {
  if (cache.has("songs")) {
    return cache.get("songs");
  }

  if (existsSync(cachePath)) {
    const songs = JSON.parse(readFileSync(cachePath).toString());
    cache.set("songs", songs);

    return songs;
  }

  return null;
}

function setCache(data: Song[]) {
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cachePath, JSON.stringify(data));
  cache.set("songs", data);
}

export default async function fetchSongs() {
  const cachedSongs = getFromCache();

  if (cachedSongs) {
    return cachedSongs as Song[];
  }

  const res = await fetch(
    "https://firebasestorage.googleapis.com/v0/b/liturgymaker.appspot.com/o/songs.json?alt=media&token=9463ebc6-eaa7-47d5-b386-d33c1f17d547"
  );
  const data = await res.json();

  setCache(data);

  return data as Song[];
}
