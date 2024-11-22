import styled from '@emotion/styled'
import { Text } from '@mantine/core'
import HourlyActivityBarChart from '../components/HourlyActivityBarChart'

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

const TimeOfDay = ({ archive, title, size }) => {
  return (
    <Root>
      <Text fz={48} fw={800}>
        {title}
      </Text>
      <HourlyActivityBarChart
        archive={archive}
        size={{
          width: size.width - 440,
          height: size.height / 1.75,
        }}
      />
    </Root>
  )
}

export default TimeOfDay
