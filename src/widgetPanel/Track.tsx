import styled from 'styled-components'

const TrackWithLabel = styled.div`
  display: flex;
  height: 60px;
`

const Label = styled.div`
  width: var(--track-label-width);
  padding: 2px;
  & div {
    padding: 5px;
    border-radius: 5px;
    height: 46px;
    background: var(--off-color-2);
    opacity: 0.7;
  }
`

const TrackBars = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`

interface SoundProps {
  name: string
  children: any
}

export default function Track(props: SoundProps) {
  return (
    <TrackWithLabel>
      <Label><div>{props.name}</div></Label>
      <TrackBars>{props.children}</TrackBars>
    </TrackWithLabel>
  )
}
