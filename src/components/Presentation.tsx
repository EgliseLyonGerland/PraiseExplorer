import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounceCallback, useEventListener } from 'usehooks-ts'
import { motion } from 'framer-motion'
import TextIncreaseIcon from './icons/TextIncrease'
import TextDecreaseIcon from './icons/TextDecrease'
import type { Song } from '@/types'
import { fontSize$, isPresentationStarted$ } from '@/libs/store'
import prepareLyrics from '@/libs/prepareLyrics'

function isTouchDevice() {
  return (('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0))
}

function isCursorInBound(event: MouseEvent, element: HTMLElement) {
  const { clientX, clientY } = event
  const { left, right, top, bottom } = element.getBoundingClientRect()

  return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom
}

function TitleSlide({ song }: { song: Song }) {
  return (
    <div className="flex flex-col gap-[3vh]">
      <h1 className="text-[8vmin] font-serif">{song.title}</h1>
      {song.authors && <h2 className="text-[4vmin]">{song.authors}</h2>}
      {song.copyright && (
        <h3 className="text-[3vmin] opacity-60">
          {`© ${song.copyright}`}
        </h3>
      )}
    </div>
  )
}

function LyricSlide({ lines, fontSize }: { lines: string[], fontSize: number }) {
  return (
    <div className="text-[min(6vw,50px)] font-serif flex flex-col gap-1">
      {lines.map((line, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="font-serif pl-4 -indent-4"
          style={{ fontSize: `${fontSize}em` }}
        >
          {line}
        </div>
      ))}
    </div>
  )
}

const defaultLyrics = [] as const

interface Props {
  song: Song
}

function PresentationInner({ song }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [controlsShown, setControlsShown] = useState(isTouchDevice())
  const fontSize = useStore(fontSize$)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const documentRef = useRef(document)
  const controlsRef = useRef<HTMLDivElement>(null)

  const hideControls = useDebounceCallback(useCallback((event: MouseEvent) => {
    const inBounds = controlsRef.current && isCursorInBound(event, controlsRef.current)

    if (!inBounds) {
      setControlsShown(false)
    }
  }, []), 3000)

  const lyrics = song.lyrics ? prepareLyrics(song.lyrics) : defaultLyrics!

  const close = () => {
    if (document.fullscreenEnabled) {
      document.exitFullscreen()
    }
    isPresentationStarted$.set(false)
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

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        prev()
        break
      case ' ':
      case 'ArrowDown':
        next()
        break
      case 'Escape':
        close()
        break
      default:
        return
    }

    event.stopPropagation()
    event.preventDefault()
  }

  const handleFullscrrenChange = () => {
    if (document.fullscreenElement === null) {
      close()
    }
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (isTouchDevice()) {
      return
    }

    hideControls(event)

    if (!controlsShown) {
      setControlsShown(true)
    }
  }

  useEventListener('cancel', close, dialogRef)
  useEventListener('click', handleDialogClick, dialogRef)
  useEventListener('keydown', handleKeyDown)
  useEventListener('fullscreenchange', handleFullscrrenChange, documentRef)
  useEventListener('mousemove', handleMouseMove)

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
      className="relative modal bg-base-300 w-screen h-screen m-0 overscroll-none items-start justify-start block"
    >
      <div className="mx-auto py-[5vh] px-8 max-w-screen-2xl tracking-wide pointer-events-none">
        {currentSlide === 0
          ? (<TitleSlide song={song} />)
          : (<LyricSlide lines={lyrics[currentSlide - 1].lines} fontSize={fontSize} />)}
      </div>

      <motion.div
        animate={{ opacity: Number(controlsShown) }}
        className="fixed inset-x-0 bottom-[4vh] flex items-center justify-center "
      >
        <div
          className="flex gap-4"
          ref={controlsRef}
        >
          <div
            className="join shadow-xl"
          >
            <button
              type="button"
              className="lg:tooltip btn btn-neutral join-item"
              data-tip="Diminuer la taille du texte"
              disabled={currentSlide === 0}
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                fontSize$.set(fontSize - 0.1)
              }}
            >
              <TextDecreaseIcon className="h-6" />
            </button>
            <button
              type="button"
              className="lg:tooltip btn btn-neutral join-item"
              data-tip="Augmenter la taille du texte"
              disabled={currentSlide === 0}
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                fontSize$.set(fontSize + 0.1)
              }}
            >
              <TextIncreaseIcon className="h-6" />
            </button>
          </div>

          <div className="join shadow-xl">
            <button
              type="button"
              className="lg:tooltip btn btn-neutral join-item"
              data-tip="Précédent"
              disabled={currentSlide === 0}
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                prev()
              }}
            >
              <ChevronUpIcon className="h-6" />
            </button>
            <button
              type="button"
              className="lg:tooltip btn btn-neutral join-item"
              data-tip="Suivant"
              disabled={currentSlide === lyrics.length}
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                next()
              }}
            >
              <ChevronDownIcon className="h-6" />
            </button>
            <button
              type="button"
              className="lg:tooltip btn btn-neutral join-item"
              data-tip="Arrêter la présentation"
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                close()
              }}
            >
              <XMarkIcon className="h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </dialog>
  )
}

export default function Presentation({ song }: Props) {
  const isStarted = useStore(isPresentationStarted$)

  return isStarted ? <PresentationInner song={song} /> : null
}
