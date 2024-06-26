import { useMemo, useState } from "react";
import Logo from "./Logo";
import MiniSearch from "minisearch";
import type { Song } from "@/types";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface Props {
  data: Song[];
  currentSongId?: string;
}

export default function Menu({ data, currentSongId }: Props) {
  const [songs, setSongs] = useState<Song[]>(data);

  const minisearch = useMemo(() => {
    const index = new MiniSearch<Song>({
      fields: ["title", "authors"],
      processTerm: (text) =>
        text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase(),
      searchOptions: {
        prefix: true,
        boost: { title: 2 },
      },
    });

    const sortedDocs = data.sort((a, b) => a.title.localeCompare(b.title));

    index.addAll(sortedDocs);

    return index;
  }, [data]);

  return (
    <div className="menu bg-base-200 text-base-content min-h-full p-8 w-[512px]">
      <div className="flex items-center gap-4">
        <Logo className="h-10 fill-base-content" />
        <span className="flex gap-2 items-center">
          <span className="font-serif font-bold text-xl leading-none">
            Chants
          </span>
          <span className="badge badge-primary badge-sm mb-4">Beta</span>
        </span>

        <label className="swap swap-rotate ml-auto">
          <input type="checkbox" className="theme-controller" value="dark" />

          <SunIcon className="swap-off size-6 fill-current" />
          <MoonIcon className="swap-on size-6 fill-current" />
        </label>
      </div>

      <div className="py-8 sticky top-0 bg-base-200 border-b border-base-300 mb-4 z-10">
        <input
          id="search"
          type="text"
          placeholder="Rechercher"
          className="input w-full"
          onChange={(event) => {
            if (!event.target.value.trim()) {
              setSongs(data);
              return;
            }

            const results = minisearch.search(event.target.value);

            setSongs(
              results
                .map((result) => data.find((doc) => doc.id === result.id))
                .filter((song) => song !== undefined)
            );
          }}
        />
      </div>

      <ul>
        {songs.map((song) => (
          <li key={song.id} className="min-w-96">
            <a
              className={clsx(
                "flex flex-col items-start gap-0 px-8",
                currentSongId === song.id && "active"
              )}
              href={`/${song.id}`}
            >
              <span className="text-lg font-serif line-clamp-1">
                {song.title}
              </span>

              <span className="line-clamp-1 opacity-60">
                {song.authors || <i>Aucun auteur</i>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
