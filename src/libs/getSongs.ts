import { readFileSync } from 'node:fs'
import type { Song } from '@/types'

const cache = new Map()
const dataDir = 'src/data'
const dataPath = `${dataDir}/songs.json`

export default async function getSongs() {
  if (cache.has('songs')) {
    return cache.get('songs') as Song[]
  }

  const data = JSON.parse(readFileSync(dataPath).toString())
  cache.set('songs', data)

  return data as Song[]
}
