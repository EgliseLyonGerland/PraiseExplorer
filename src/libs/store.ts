import { atom } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'

export const isPresentationStarted$ = atom(false)

export const fontSize$ = persistentAtom<number>('font-size', 1, {
  encode: String,
  decode: Number,
})
