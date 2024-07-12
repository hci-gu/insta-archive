import styled from '@emotion/styled'
import { Text } from '@mantine/core'
import LineChart from './ActivityTimeline'
import React, { useState } from 'react'
import { useCurrentFrame } from 'remotion'

const Root = styled.div`
  position: fixed;
  width: 100%;
  height: 120px;
  left: 16px;
  /* bottom: 32px; */
  /* display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  } */
`

// React

const Scrubber = ({ archive, title, size, scrollRef, playerRef }) => {
  const [scroll, setScroll] = useState({ x: 0, y: 0 })
  const frame = useCurrentFrame()

  return (
    <Root>
      <LineChart
        playerRef={playerRef}
        archive={archive}
        data={archive.activities}
        size={{
          width: size.width - 32,
          height: 120,
        }}
        padding={8}
      />
    </Root>
  )
}

export default Scrubber
