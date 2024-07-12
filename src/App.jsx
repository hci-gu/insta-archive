import React, { useRef } from 'react'

import { AppShell, Center, Container, Flex, Image, Text } from '@mantine/core'
import { useInstagramArchive } from 'insta-archive-hook'

import moment from 'moment'
import UploadFile from './components/UploadFile'
import { Player } from '@remotion/player'
import { useCurrentFrame } from 'remotion'
import { useElementSize } from '@mantine/hooks'
import InstagramActivity from './components/InstagramActivity'
import styled from '@emotion/styled'
import Introduction from './pages/Introduction'
import FirstPost from './pages/FirstPost'
import ActivityTimeline from './pages/ActivityTimeline'
import Likes from './pages/Likes'
import LikesTimeline from './components/LikesTimeline'
import InteractionsTimeline from './pages/LikesTimeline'

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
  if (!activity || frame == 0) return null

  const year = moment(activity.timestamp).year()
  const month = moment(activity.timestamp).month()
  const day = padLeft(moment(activity.timestamp).date())

  return (
    <Flex mt={18} ml={24} w={225} style={{ position: 'fixed' }}>
      <Image src={logoForYear(parseInt(year))} w={50} h={50} />
      <Container flex="column" mt={8}>
        <Text fz={64} fw={900} lh={0.6}>
          {year}
        </Text>
        <Text fz={32} fw={200}>
          {day}/{month}
        </Text>
      </Container>
    </Flex>
  )
}

const NUM_PAGES = 6

const Pages = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${NUM_PAGES * 100}vh;

  /* > div {
    position: relative;
    display: flex;
    flex-direction: column;
    width: '100%';
    height: '100vh';
    border: '1px solid black';
  } */
`

const VideoComponent = ({ playerRef, archive, size }) => {
  const scrollRef = useRef()

  return (
    <div style={{ width: '100%', overflowY: 'scroll' }} ref={scrollRef}>
      <DateDisplayer archive={archive} />
      {size.width > 0 && (
        <>
          <InstagramActivity
            archive={archive}
            scrollRef={scrollRef}
            size={size}
          />
          {/* <Scrubber
            archive={archive}
            scrollRef={scrollRef}
            playerRef={playerRef}
            size={size}
          /> */}
        </>
      )}

      <Pages>
        <div>
          <Introduction archive={archive} />
        </div>
        <div>
          <FirstPost playerRef={playerRef} />
        </div>
        <div>
          <ActivityTimeline
            title={'Dina inlägg/Stories över tid'}
            archive={archive}
            size={size}
            playerRef={playerRef}
          />
        </div>
        <div>
          <InteractionsTimeline
            title={'Dina interaktioner över tid'}
            archive={archive}
            size={size}
            playerRef={playerRef}
          />
        </div>
        {/* <div>
          <ActivityTimeline
            title={'Dina stories över tid'}
            archive={archive}
            data={archive.activities.filter((o) => o.type == 'Story')}
            size={size}
            playerRef={playerRef}
          />
        </div> */}
        <div>
          <Likes title="Konton du interagerar mest med" archive={archive} />
        </div>
      </Pages>
    </div>
  )
}

const PlayerWrapper = ({ archive, size }) => {
  const playerRef = useRef()
  if (size.width === 0 || size.height === 0) {
    return <Text>Waiting for size</Text>
  }

  return (
    <Player
      ref={playerRef}
      fps={24}
      durationInFrames={archive.activities.length}
      component={() => (
        <VideoComponent archive={archive} size={size} playerRef={playerRef} />
      )}
      compositionWidth={size.width}
      compositionHeight={size.height}
      style={{ width: '100%', height: '100%' }}
      // controls
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
