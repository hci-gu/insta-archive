import styled from '@emotion/styled'
import { Text } from '@mantine/core'
import LineChart from '../components/PublicVsPrivateChart'

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

const PublicVsPrivate = ({ archive, title, size, playerRef }) => {
  return (
    <Root>
      <div style={{ marginLeft: 0, marginTop: 128 }}>
        <Text fz={48} fw={800}>
          {title}
        </Text>
        <LineChart
          playerRef={playerRef}
          archive={archive}
          size={{
            width: size.width - 175,
            height: size.height / 1.75,
          }}
        />
      </div>
    </Root>
  )
}

export default PublicVsPrivate
