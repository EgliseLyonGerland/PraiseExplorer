import { PlayIcon } from '@heroicons/react/24/outline'
import Preview from './Preview'
import type { Song } from '@/types'
import { isPresentationStarted } from '@/libs/store'

interface Props {
  song: Song
}

export default function SongDetails({ song }: Props) {
  const collections = song.collection?.split(',').map(item => item.trim()).filter(Boolean) || []

  return (
    <aside className="text-lg">
      <div className="hidden 2xl:block mb-12">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            isPresentationStarted.set(true)
          }}
        >
          <PlayIcon className="h-6" />
          Présenter
        </button>

      </div>

      <h2 className="text-xl font-bold mb-6">Détails du chant</h2>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="mb-1">Auteur(s)</h3>
          <p className="opacity-70">{song.authors ? song.authors : 'N/C'}</p>
        </div>
        <div>
          <h3 className="mb-1">Copyright</h3>
          <p className="opacity-70">{song.copyright ? `© ${song.copyright}` : 'N/C'}</p>
        </div>
        {collections.length > 0 && (
          <div>
            <h3 className="mb-1">{collections.length ? 'Recueil' : 'Recueils'}</h3>
            <p className="opacity-70">
              {collections.map(collection =>
                <div key={collection} className="badge badge-outline">{collection}</div>)}
            </p>
          </div>
        )}
        {song.translation && (
          <div>
            <h3 className="mb-1">Traduction</h3>
            <p className="opacity-70">{song.translation}</p>
          </div>
        )}
      </div>

      <div className="divider"></div>

      {song.previewUrl && (
        <div>
          <h2 className="text-xl font-bold mb-6">Aperçu</h2>
          <Preview
            title={song.title}
            url={song.previewUrl}
          />
        </div>
      )}
    </aside>
  )
}
