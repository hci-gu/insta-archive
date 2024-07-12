import styled from '@emotion/styled'
import { Text } from '@mantine/core'
import { useInViewport } from '@mantine/hooks'
import moment from 'moment'
import { useEffect } from 'react'
import { useCurrentFrame } from 'remotion'

const Root = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const FirstPost = ({ playerRef }) => {
  const currentFrame = useCurrentFrame()
  const { ref, inViewport } = useInViewport()

  useEffect(() => {
    if (!playerRef.current) return
    if (inViewport && currentFrame !== 0 && !playerRef.current.isPlaying()) {
      playerRef.current.seekTo(0)
    }
  }, [inViewport, currentFrame])

  return (
    <Root>
      <Text fz={64} fw={800} mt={128} ref={ref}>
        Ditt första inlägg
      </Text>
    </Root>
  )
}

export default FirstPost
