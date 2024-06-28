import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/react'
import { useEffect, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import type { Song } from '@/types'
import { isPresentationStarted } from '@/libs/store'
import prepareLyrics from '@/libs/prepareLyrics'

interface Props {
  song: Song
}

function TitleSlide({ song }: { song: Song }) {
  return (
    <div className="flex flex-col gap-[3vh]">
      <h1 className="text-[8vmin] font-serif">{song.title}</h1>
      {song.authors && <h2 className="text-[4vmin]">{song.authors}</h2>}
      {song.copyright && (
        <h3 className="text-[3vmin] opacity-60">
          ©
          {song.copyright}
        </h3>
      )}
    </div>
  )
}

function LyricSlide({ lines }: { lines: string[] }) {
  return (
    <div className="text-[min(6vw,50px)] font-serif flex flex-col gap-1">
      {lines.map((line, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className="font-serif pl-4 -indent-4">
          {line}
        </div>
      ))}
    </div>
  )
}

const defaultLyrics = [] as const

function PresentationInner({ song }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const documentRef = useRef(document)

  const lyrics = song.lyrics ? prepareLyrics(song.lyrics) : defaultLyrics!

  const close = () => {
    if (document.fullscreenEnabled) {
      document.exitFullscreen()
    }
    isPresentationStarted.set(false)
  }

  const prev = () => {
    setCurrentSlide(Math.max(0, currentSlide - 1))
  }

  const next = () => {
    if (currentSlide >= lyrics.length) {
      close()
      return
    }

    setCurrentSlide(currentSlide + 1)
  }

  const handleDialogClick = (event: MouseEvent) => {
    if (event.target === dialogRef.current) {
      event.stopPropagation()
      event.preventDefault()
      next()
    }
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      event.stopPropagation()
      event.preventDefault()
      next()
    }
  }

  const handleFullscrrenChange = () => {
    if (document.fullscreenElement === null) {
      close()
    }
  }

  useEventListener('cancel', close, dialogRef)
  useEventListener('click', handleDialogClick, dialogRef)
  useEventListener('keypress', handleKeyPress)
  useEventListener('fullscreenchange', handleFullscrrenChange, documentRef)

  useEffect(() => {
    async function open() {
      if (document.fullscreenEnabled) {
        await document.documentElement.requestFullscreen()
      }
      dialogRef.current?.showModal()
      dialogRef.current?.focus()
    }

    open()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="relative modal bg-base-200 w-screen h-screen m-0 overscroll-none items-start justify-start block"
    >
      <div className="mx-auto py-[5vh] px-[5vw] max-w-screen-2xl tracking-wide pointer-events-none">
        {currentSlide === 0
          ? (<TitleSlide song={song} />)
          : (<LyricSlide lines={lyrics[currentSlide - 1].lines} />)}
      </div>

      <div className="fixed inset-x-0 bottom-[4vh] flex items-center justify-center gap-[5vw]">
        <div className="join">
          <button
            type="button"
            className="tooltip btn btn-neutral join-item"
            data-tip="Précédent"
            onClick={(event) => {
              event.stopPropagation()
              event.preventDefault()
              prev()
            }}
          >
            <ChevronUpIcon className="h-6"></ChevronUpIcon>
          </button>
          <button
            type="button"
            className="tooltip btn btn-neutral join-item"
            data-tip="Suivant"
            onClick={(event) => {
              event.stopPropagation()
              event.preventDefault()
              next()
            }}
          >
            <ChevronDownIcon className="h-6"></ChevronDownIcon>
          </button>
          <button
            type="button"
            className="tooltip btn btn-neutral join-item"
            data-tip="Arrêter la présentation"
            onClick={(event) => {
              event.stopPropagation()
              event.preventDefault()
              close()
            }}
          >
            <XMarkIcon className="h-6"></XMarkIcon>
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default function Presentation({ song }: Props) {
  const isStarted = useStore(isPresentationStarted)

  return isStarted ? <PresentationInner song={song} /> : null
}
