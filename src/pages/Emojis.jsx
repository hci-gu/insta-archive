import styled from '@emotion/styled'
import WordCloud from '../components/WordCloud'
import React from 'react'
import { Text } from '@mantine/core'

const Root = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

function extractEmojis(text) {
  // Regex to match emojis
  const emojiRegex = /(\p{EPres}|\p{ExtPict})(\u200d(\p{EPres}|\p{ExtPict}))*/gu
  // Match the emojis and return them
  return text.match(emojiRegex) || []
}

const Emojis = ({ archive, title }) => {
  const comments = archive.interactions
    .filter((o) => o.type === 'Comment')
    .map((o) => o.content)
    .flatMap(extractEmojis)
    .join(' ')
  const captions = archive.activities
    .map((o) => o.caption)
    .flatMap(extractEmojis)
    .join(' ')

  return (
    <>
      <Root>
        <div>
          <Text fz={36} fw={800}>
            Emojis du skrivit i inlägg och stories
          </Text>
          <WordCloud width={700} height={500} data={captions} />
        </div>
        <div>
          <Text fz={36} fw={800}>
            Emojis du skrivit som kommenterarer
          </Text>
          <WordCloud width={700} height={500} data={comments} />
        </div>
      </Root>
    </>
  )
}

const MemoizedEmojis = React.memo(Emojis, (prev, next) => {
  return prev.archive.interactions.length === next.archive.interactions.length
})

export default MemoizedEmojis
