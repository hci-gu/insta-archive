// file:///Users/sebastianandreasson/Documents/Tester%20med%20min%20egen%20data/instagram-beata_j-2024-03-07-2Lvo0rP9/your_instagram_activity/content/posts_1.html

import React from 'react'
import DarkModeToggle from './components/DarkModeToggle'
import { AppShell, Center, Container, Flex, Image, Text } from '@mantine/core'
import { useInstagramArchive } from 'insta-archive-hook'

import { unwrap } from 'jotai/utils'
import moment from 'moment'
import { scaleBand, scaleLinear } from '@visx/scale'
import { Group } from '@visx/group'
import { Bar, LinePath, arc } from '@visx/shape'
import { AxisBottom } from '@visx/axis'
import UploadFile from './components/UploadFile'
import { Player } from '@remotion/player'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import LineChart from './components/LineChart'
import { useElementSize, useViewportSize } from '@mantine/hooks'
import InstagramActivity from './components/InstagramActivity'

const padLeft = (str, len = 2, char) =>
  Array(len - String(str).length + 1).join('0') + str

const logoForYear = (year) => {
  if (year <= 2010) {
    return '/icons/2010.png'
  } else if (year <= 2011) {
    return '/icons/2011.png'
  } else if (year <= 2012) {
  } else if (year <= 2016) {
    return '/icons/2016.png'
  } else if (year <= 2022) {
    return '/icons/2022.png'
  }
  return '/icons/2022.png'
}

const DateDisplayer = ({ archive }) => {
  const frame = useCurrentFrame()
  const activity = archive.activities[frame]
  if (!activity) return null

  const year = moment(activity.timestamp).year()
  const month = moment(activity.timestamp).month()
  const day = padLeft(moment(activity.timestamp).date())

  return (
    <Flex mt={24} ml={24} w={225}>
      <Image src={logoForYear(parseInt(year))} w={64} h={64} />
      <Container flex="column">
        <Text fz={72} fw={900} lh={0.6}>
          {year}
        </Text>
        <Text fz={48} fw={200}>
          {day}/{month}
        </Text>
      </Container>
    </Flex>
  )
}

const VideoComponent = ({ archive, size }) => {
  return (
    <AbsoluteFill>
      <DateDisplayer archive={archive} />
      <Center h={'60%'}>
        <InstagramActivity archive={archive} />
      </Center>
      <LineChart
        archive={archive}
        size={{
          width: size.width,
          height: size.height / 3,
        }}
      />
    </AbsoluteFill>
  )
}

const PlayerWrapper = ({ archive, size }) => {
  if (size.width === 0 || size.height === 0) {
    return <Text>Waiting for size</Text>
  }

  return (
    <Player
      fps={24}
      durationInFrames={archive.activities.length}
      component={() => <VideoComponent archive={archive} size={size} />}
      compositionWidth={size.width}
      compositionHeight={size.height}
      controls
      // alwaysShowControls
    />
  )
}

const FullSizeContainer = ({ archive }) => {
  const { ref, width, height } = useElementSize()

  return (
    <div
      style={{
        height: '100vh',
      }}
      ref={ref}
    >
      <PlayerWrapper archive={archive} size={{ width, height }} />
    </div>
  )
}

const App = () => {
  const [archive, setFile] = useInstagramArchive()
  if (archive) {
    archive.activities.sort((a, b) => a.timestamp - b.timestamp)
  }

  return (
    <AppShell>
      <AppShell.Main>
        {!archive && <UploadFile setFile={setFile} />}
        {archive && <FullSizeContainer archive={archive} />}
      </AppShell.Main>
    </AppShell>
  )
}

export default App
