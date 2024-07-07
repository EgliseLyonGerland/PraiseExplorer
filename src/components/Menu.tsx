import { useMemo, useRef, useState } from 'react'
import MiniSearch from 'minisearch'
import clsx from 'clsx'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { Song } from '@/types'

interface Props {
  data: Song[]
  currentSongId?: string
}

export default function Menu({ data, currentSongId }: Props) {
  const [songs, setSongs] = useState<Song[]>(data)
  const inputRef = useRef<HTMLInputElement>(null)

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
      <div className="py-4 sm:py-6 sticky top-0 bg-base-200 border-b border-base-content/10 mb-4 z-10">
        <label className="input w-full flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher"
            className="grow peer"
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
          <button
            type="button"
            className="btn btn-ghost btn-circle btn-sm peer-placeholder-shown:hidden"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = ''
                setSongs(data)
                inputRef.current.focus()
              }
            }}
          >
            <XMarkIcon className="h-5" />
          </button>
        </label>
      </div>

      <ul>
        {songs.map(song => (
          <li key={song.id}>
            <a
              data-id={song.id}
              className={clsx(
                'flex flex-col items-start gap-0 px-2 sm:px-4 rounded-lg lg:text-lg',
                currentSongId === song.id && 'active',
              )}
              href={`/${song.id}`}
            >
              <span className="font-serif line-clamp-1">
                {song.title}
              </span>

              <span className="line-clamp-1 opacity-40">
                {song.authors || <i>Aucun auteur</i>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
