import styled from '@emotion/styled'
import { Card, Center, SimpleGrid, Text } from '@mantine/core'
import AnimatedNumbers from 'react-animated-numbers'
import moment from 'moment'
import twemoji from 'twemoji'

const Root = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StatCard = styled(Card)`
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background-color: #e0dfd5;

  > strong {
    font-size: 56px;
    font-weight: 800;
    line-height: 1;
  }
  > span {
    font-size: 18px;
    font-weight: 200;
  }
`

const Stat = ({ value, text }) => {
  return (
    <StatCard shadow="md">
      <strong>
        <AnimatedNumbers
          // locale="sv-SE"
          includeComma
          transitions={(index) => ({
            type: 'spring',
            duration: index + 0.1,
          })}
          animateToNumber={value}
        />
      </strong>
      <span>{text}</span>
    </StatCard>
  )
}

const mostCommonEmoji = (text) => {
  const emojiMap = text.split(' ').reduce((acc, curr) => {
    if (curr in acc) {
      acc[curr] += 1
    } else {
      acc[curr] = 1
    }
    return acc
  }, {})
  return Object.keys(emojiMap).reduce((a, b) =>
    emojiMap[a] > emojiMap[b] ? a : b
  )
}

function extractEmojis(text) {
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu
  // Match the emojis and return them
  // if (text.match(emojiRegex)) {
  //   console.log(text.match(emojiRegex), text)
  // }
  return text.replace(/\uFE0F/g, '').match(emojiRegex) || []
}

const Introduction = ({ archive }) => {
  const postCount = archive.activities.filter((o) => o.type == 'Post').length
  const storiesCount = archive.activities.filter(
    (o) => o.type == 'Story'
  ).length
  const likesCount = archive.interactions.filter(
    (o) => o.type == 'Like' && o.onType == 'Post'
  ).length
  const commentLikeCount = archive.interactions.filter(
    (o) => o.type == 'Like' && o.onType == 'Comment'
  ).length
  const comments = archive.interactions.filter(
    (o) => o.type == 'Comment'
  ).length
  const dms = archive.directMessages.filter((o) => o.sentByMe).length

  return (
    <Root>
      <Text fz={32} fw={200}>
        Du skapade ditt konto{' '}
        <strong style={{ fontWeight: 800 }}>
          {moment(archive.startDate).format('YYYY-MM-DD')}
        </strong>
        .
      </Text>
      <Text fz={16} fw={200}>
        Sedan dess har du gjort följande:
      </Text>
      <SimpleGrid cols={3} w={'50%'} m={'32px auto'} spacing="md">
        <Stat value={postCount} text="Inlägg" />
        <Stat value={storiesCount} text="Stories" />
        <Stat value={likesCount} text="Inlägg du gillat" />
        <Stat value={commentLikeCount} text="Kommentarer du gillat" />
        <Stat value={comments} text="Kommentarer du skrivit" />
        <Stat value={dms} text="Skickade DMs" />
      </SimpleGrid>
    </Root>
  )
}

export default Introduction
