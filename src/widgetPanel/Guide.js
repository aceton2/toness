import styled from 'styled-components';

const GuideBox = styled.div`
    display: grid;
    grid-template-columns: repeat(32, 1fr);
    text-align: center;
    font-size: 0.7rem;
    line-height: 1rem;
    margin-left: var(--track-label-width);
`

function generateGuides(barNum, resolutionPerBar = 8) {
    return Array(barNum * resolutionPerBar).fill(null).map((e, index) => {
        return <div key={index} className={`
            ${(index % resolutionPerBar === 0) ? "downbeat" : ""}
            ${(index % resolutionPerBar === resolutionPerBar / 2) ? "backbeat" : ""}
            `
        }
        >
            {(index % 2 === 1) ? '+' : (index % resolutionPerBar) / 2 + 1}
        </div>
    }

    )
}

export default function Guide(props) {
    return (
        <GuideBox>
            {generateGuides(props.bars)}
        </GuideBox>
    );
}