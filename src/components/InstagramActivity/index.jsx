// type Post = {
//     timestamp: Date
//     caption: string
//     media: []
// }

import { Flex, Image, Text } from '@mantine/core'
import { useCurrentFrame } from 'remotion'
import styled from '@emotion/styled'

const IMAGE_WIDTH = 384

const Wrapper = styled.div`
  width: ${IMAGE_WIDTH + 32}px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  z-index: 1;
  background-color: white;
  /* align-items: center; */

  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 12px;

  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);

  > img {
    align-self: center;
    max-height: ${IMAGE_WIDTH}px;
    min-height: ${IMAGE_WIDTH}px;
  }

  strong {
    color: #00537d;
  }
  span {
    color: #848484;
  }
`

const Caption = styled.div`
  margin-top: 4px;
  > span {
    margin-left: 8px;
  }
`

const ProfileRow = ({ profile }) => {
  const profilePic = profile.profilePictures[0].media

  return (
    <Flex pb={8} align="center">
      <Image src={profilePic} w={32} h={32} />
      <Text fw={600} ml={8} c="#00537D">
        {profile.username}
      </Text>
    </Flex>
  )
}

const InstagramActivity = ({ activity, profile }) => {
  return (
    <Wrapper>
      <ProfileRow profile={profile} />
      {activity.type == 'Post' && (
        <Image
          src={activity.media[0]}
          alt={activity.caption}
          w={IMAGE_WIDTH}
          h={IMAGE_WIDTH}
          fit="contain"
          bg={'black'}
        />
      )}
      {activity.type == 'Story' && (
        <video
          src={activity.media[0]}
          alt={activity.caption}
          width={IMAGE_WIDTH}
          height={IMAGE_WIDTH}
          style={{
            objectFit: 'contain',
            backgroundColor: 'black',
          }}
        />
      )}
      <Caption>
        <strong>{profile.username}</strong>
        <span>{activity.caption}</span>
      </Caption>
    </Wrapper>
  )
}

const InstagramActivityWrapper = ({ archive }) => {
  const frame = useCurrentFrame()
  const activity = archive.activities[frame]

  if (!activity) {
    return null
  }

  return <InstagramActivity activity={activity} profile={archive.profile} />
}

export default InstagramActivityWrapper
