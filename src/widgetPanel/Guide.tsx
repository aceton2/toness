import { Slot } from '../_services/interfaces'
import styled from 'styled-components'
import useToneStore, { selectIsFullGrid } from '../_store/store'

const GuideBox = styled.div<{ double: boolean }>`
  display: grid;
  grid-template-columns: repeat(${props => props.double ? 64 : 32}, 1fr);
  text-align: center;
  font-size: 0.7rem;
  line-height: 1rem;
  margin-left: var(--track-label-width);

  & > div.highlight {
    border-radius: 5px;
    background-color: var(--off-color-2);
    opacity: 0.7;
  }
`

const sixteenthStr = {
  '1': 'e',
  '2': '+',
  '3': 'a',
}

export default function Guide(props: { activeStep: string; slots: Array<Slot> }) {
  const doubledGrid = useToneStore(selectIsFullGrid)

  function generateGuides() {
    return props.slots.map((slot) => {
      return (
        <div key={slot.timeId} className={slot.timeId === props.activeStep ? 'highlight' : ''}>
          {slotToGuideName(slot.timeId)}
        </div>
      )
    })
  }

  function slotToGuideName(slot: any) {
    const [_, quarter, sixteenth] = slot.split(':');
    return sixteenth === '0' ? parseInt(quarter) + 1 : sixteenthStr[sixteenth as '1' | '2' | '3']
  }

  return <GuideBox double={doubledGrid}>{generateGuides()}</GuideBox>
}
