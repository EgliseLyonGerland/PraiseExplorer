import Player from 'react-player/lazy'

interface Props {
  title: string
  url: string
}

export default function Preview({ title, url }: Props) {
  if (url.includes('drive.google.com')) {
    return (
      // eslint-disable-next-line react-dom/no-missing-iframe-sandbox
      <iframe
        height="140"
        src={url.replace('/view', '/preview')}
        title={`${title} preview`}
        width="100%"
        loading="lazy"
      />
    )
  }

  return <Player url={url} width="100%" height={260} controls />
}
