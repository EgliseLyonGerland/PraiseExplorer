import { useMemo, useState } from 'react'
import MiniSearch from 'minisearch'
import clsx from 'clsx'
import type { Song } from '@/types'

interface Props {
  data: Song[]
  currentSongId?: string
}

export default function Menu({ data, currentSongId }: Props) {
  const [songs, setSongs] = useState<Song[]>(data)

  const minisearch = useMemo(() => {
    const index = new MiniSearch<Song>({
      fields: ['title', 'authors'],
      processTerm: text =>
        text
          .normalize('NFD')
          .replace(/[\u0300-\u036F]/g, '')
          .toLocaleLowerCase(),
      searchOptions: {
        prefix: true,
        boost: { title: 2 },
      },
    })

    const sortedDocs = data.sort((a, b) => a.title.localeCompare(b.title))

    index.addAll(sortedDocs)

    return index
  }, [data])

  return (
    <>
      <div className="py-4 sm:py-8 sticky top-0 bg-base-200 border-b border-base-300 mb-4 z-10">
        <input
          id="search"
          type="text"
          placeholder="Rechercher"
          className="input w-full"
          onChange={(event) => {
            if (!event.target.value.trim()) {
              setSongs(data)
              return
            }

            const results = minisearch.search(event.target.value)

            setSongs(
              results
                .map(result => data.find(doc => doc.id === result.id))
                .filter(song => song !== undefined),
            )
          }}
        />
      </div>

      <ul>
        {songs.map(song => (
          <li key={song.id}>
            <a
              data-id={song.id}
              className={clsx(
                'flex flex-col items-start gap-0 px-6 sm:px-8',
                currentSongId === song.id && 'active',
              )}
              href={`/${song.id}`}
            >
              <span className="sm:text-lg font-serif line-clamp-1">
                {song.title}
              </span>

              <span className="line-clamp-1 opacity-60">
                {song.authors || <i>Aucun auteur</i>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
