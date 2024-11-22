import { Flex, Image, Text } from '@mantine/core'
import { useCurrentFrame, Easing, interpolate } from 'remotion'

import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

const phoneFrameForYear = (year) => {
  if (year <= 2011) {
    return '/phones/2011.png'
  } else if (year <= 2012) {
    return '/phones/2012.png'
  } else if (year <= 2013) {
    return '/phones/2013.png'
  } else if (year <= 2014) {
    return '/phones/2014.png'
  } else if (year <= 2016) {
    return '/phones/2016.png'
  } else if (year <= 2017) {
    return '/phones/2017.png'
  }
  return '/phones/2018.png'
}

const aspectRatioForYear = (year) => {
  if (year <= 2011) {
    return 1.89
  } else if (year <= 2012) {
    return 2.09
  } else if (year <= 2014) {
    return 2.01
  }
  return 2.02
}

const horizontalPaddingForYear = (actvityType, year) => {
  if (actvityType === 'Story') {
    return 14
  }

  if (year <= 2011) {
    return 32
  } else if (year <= 2012) {
    return 32
  } else if (year <= 2014) {
    return 24
  } else if (year <= 2016) {
    return 32
  }
  return 18
}

const verticalPaddingForYear = (activityType, year) => {
  if (activityType === 'Story') {
    return 12
  }
  if (year <= 2011) {
    return 156
  } else if (year <= 2012) {
    return 156
  } else if (year <= 2014) {
    return 148
  }
  return 148
}

const ELEMENT_WIDTH = 300
const ELEMENT_PADDING = 16
const IMAGE_WIDTH = ELEMENT_WIDTH - ELEMENT_PADDING * 2

const Wrapper = styled.div`
  position: fixed;
  top: calc(33% - ${ELEMENT_WIDTH / 2}px);
  right: 32px;

  width: ${ELEMENT_WIDTH}px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  z-index: 1;

  > img {
    position: absolute;
    z-index: -1;
  }

  strong {
    color: #00537d;
  }
  span {
    color: #848484;
  }
`

const Caption = styled.div`
  font-size: 14px;

  margin-top: 4px;
  > span {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const ProfileRow = ({ profile, year }) => {
  const profilePic = profile.profilePictures[0].media
  const radius = year >= 2017 ? 12 : 0
  const ml = year >= 2017 ? 4 : 0

  return (
    <Flex pb={8} align="center">
      <Image src={profilePic} w={24} h={24} radius={radius} ml={ml} />
      <Text fw={600} ml={8} c="#00537D">
        {profile.username}
      </Text>
    </Flex>
  )
}

const PostWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: ${({ year, activityType }) =>
      verticalPaddingForYear(activityType, year)}px
    ${({ year, activityType }) =>
      horizontalPaddingForYear(activityType, year)}px;

  /* padding-top: 148px; */
`

const mediaWidthForActivityAndYear = (activityType, year) => {
  return ELEMENT_WIDTH - horizontalPaddingForYear(activityType, year) * 2
}
const mediaHeightForActivityAndYear = (activityType, year) => {
  if (activityType === 'Post') {
    return ELEMENT_WIDTH - horizontalPaddingForYear(activityType, year) * 2
  }
  return (
    (ELEMENT_WIDTH - horizontalPaddingForYear(activityType, year) * 2) * 2.15
  )
}

const ActivityMedia = ({ media, caption, year, activityType }) => {
  if (!media || !media.length) return null
  if (!media[0]) return null

  const { type, url } = media[0]
  const borderRadius = activityType == 'Story' ? 32 : 0

  if (type == 'video') {
    return (
      <video
        autoPlay
        src={url}
        alt={caption}
        width={mediaWidthForActivityAndYear(activityType, year)}
        height={mediaHeightForActivityAndYear(activityType, year)}
        type="video/mp4"
        style={{
          objectFit: 'contain',
          backgroundColor: 'black',
          borderRadius,
        }}
      />
    )
  }

  return (
    <Image
      src={url}
      alt={caption}
      w={mediaWidthForActivityAndYear(activityType, year)}
      h={mediaHeightForActivityAndYear(activityType, year)}
      fit="contain"
      bg={'black'}
      style={{
        borderRadius,
      }}
    />
  )
}

const InstagramActivity = ({ activity, profile, offsetLeft }) => {
  const year = new Date(activity.timestamp).getFullYear()
  return (
    <Wrapper style={{ right: offsetLeft }}>
      <img
        width={ELEMENT_WIDTH}
        height={ELEMENT_WIDTH * aspectRatioForYear(year)}
        src={phoneFrameForYear(year)}
      ></img>
      <PostWrapper year={year} activityType={activity.type}>
        {activity.type === 'Post' && (
          <ProfileRow profile={profile} year={year} />
        )}
        <ActivityMedia
          media={activity.media}
          caption={activity.caption}
          activityType={activity.type}
          year={year}
        />
        {activity.type === 'Post' && (
          <Caption>
            <span>
              <strong>{profile.username}</strong> {activity.caption}
            </span>
          </Caption>
        )}
      </PostWrapper>
    </Wrapper>
  )
}

const InstagramActivityWrapper = ({ archive, size, scrollRef }) => {
  const [scroll, setScroll] = useState({ x: 0, y: 0 })
  const frame = useCurrentFrame()
  const activity = archive.activities[frame]

  const handleScroll = () => {
    if (scrollRef.current) {
      setScroll({
        x: scrollRef.current.scrollLeft,
        y: scrollRef.current.scrollTop,
      })
    }
  }

  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const padding = 16
  const outsideRight = -ELEMENT_WIDTH
  const outsideLeft = size.width + ELEMENT_WIDTH
  const left = size.width - ELEMENT_WIDTH - padding
  const middle = size.width / 2 - ELEMENT_WIDTH / 2
  const right = padding

  const offsetLeft = interpolate(
    scroll.y,
    [
      0,
      size.height * 0.4,
      size.height * 0.8,
      size.height * 1.8,
      size.height * 2,
      size.height * 2.25,
      size.height * 3.5,
      size.height * 4,
    ],
    [outsideRight, outsideRight, middle, middle, left, left, left, outsideLeft],
    {
      easing: Easing.elastic(0.5),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  if (!activity) {
    return null
  }

  return (
    <InstagramActivity
      activity={activity}
      profile={archive.profile}
      offsetLeft={offsetLeft}
    />
  )
}

export default InstagramActivityWrapper
