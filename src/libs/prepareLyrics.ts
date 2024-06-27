import type { Song } from '@/types'

function sanitize(text: string) {
  return text.trim().replace(/ (.{1,2})$/, ' $1')
}

export default function prepareLyrics(lyrics: NonNullable< Song['lyrics']>) {
  return lyrics.map(part => ({
    type: part.type,
    lines: part.text.split('\n')
      .map(sanitize)
      .filter(line => line !== ''),
  }))
}
