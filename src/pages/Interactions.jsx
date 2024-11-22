import styled from '@emotion/styled'
import { Text } from '@mantine/core'
import InteractionsTimeline from '../components/InteractionsTimeline'
import React from 'react'

const Root = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const MemoizedInteractionsTimeline = React.memo(
  InteractionsTimeline,
  (prev, next) => {
    return prev.archive.interactions.length === next.archive.interactions.length
  }
)

const Interactions = ({ archive, title, size, playerRef }) => {
  return (
    <Root>
      <div style={{ marginLeft: 275, marginTop: 128 }}>
        <Text fz={48} fw={800}>
          {title}
        </Text>
        <MemoizedInteractionsTimeline
          playerRef={playerRef}
          archive={archive}
          size={{
            width: size.width - 440,
            height: size.height / 1.75,
          }}
        />
      </div>
    </Root>
  )
}

export default Interactions
