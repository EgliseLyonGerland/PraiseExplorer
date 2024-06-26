import { useMemo, useState } from "react";
import Logo from "./Logo";
import MiniSearch from "minisearch";
import extractDocumentId from "../libs/extractDocumentId";

type Doc = typeof import("../../data/songs.json")["documents"][number];

interface Props {
  docs: Doc[];
}

export default function Menu({ docs }: Props) {
  const [songs, setSongs] = useState<Doc[]>(docs);

  const minisearch = useMemo(() => {
    const index = new MiniSearch<Doc>({
      fields: ["title", "authors"],
      extractField: (doc, fieldName) => {
        switch (fieldName) {
          case "id":
            return doc.name;
          case "authors":
            return doc.fields.authors?.stringValue || "";
          case "title":
          default:
            return doc.fields.title.stringValue;
        }
      },
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

    const sortedDocs = docs.sort((a, b) =>
      a.fields.title.stringValue.localeCompare(b.fields.title.stringValue)
    );

    index.addAll(sortedDocs);

    return index;
  }, [docs]);

  return (
    <div className="menu bg-base-200 text-base-content min-h-full p-8 w-[512px]">
      <div className="flex items-center gap-4">
        <Logo className="h-10 fill-base-content" />
        <span className="flex gap-2 items-center">
          <span className="font-serif font-bold text-xl leading-none">
            Chants
          </span>
          <span className="badge badge-secondary badge-sm mb-4">Beta</span>
        </span>
      </div>

      <div className="py-8 sticky top-0 bg-base-200 border-b border-base-300 mb-4 z-10">
        <input
          id="search"
          type="text"
          placeholder="Rechercher"
          className="input w-full"
          onChange={(event) => {
            if (!event.target.value.trim()) {
              setSongs(docs);
              return;
            }

            const results = minisearch.search(event.target.value);

            setSongs(
              results
                .map((result) => docs.find((doc) => doc.name === result.id))
                .filter((song) => song !== undefined)
            );
          }}
        />
      </div>

      <ul>
        {songs.map((song) => (
          <li key={song.name} className="min-w-96">
            <a
              className="flex flex-col items-start gap-0 px-8"
              href={`/${extractDocumentId(song.name)}`}
            >
              <span className="text-lg font-serif line-clamp-1">
                {song.fields.title.stringValue}
              </span>

              <span className="line-clamp-1 opacity-60">
                {song.fields.authors?.stringValue ? (
                  song.fields.authors.stringValue
                ) : (
                  <i>Aucun auteur</i>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
