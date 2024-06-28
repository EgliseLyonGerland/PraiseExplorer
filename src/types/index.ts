export interface Song {
  id: string
  title: string
  authors?: string
  copyright?: string
  previewUrl?: string
  collection?: string
  aka?: string
  translation?: string
  number?: number
  lyrics?: {
    text: string
    type: 'chorus' | 'verse'
  }[]
}
