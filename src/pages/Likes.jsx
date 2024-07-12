import styled from '@emotion/styled'
import WordCloud from '../components/WordCloud'
import React from 'react'
import { Text } from '@mantine/core'

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

const Likes = ({ archive, title }) => {
  const data = archive.interactions.map((o) => o.mediaOwner).join(' ')

  return (
    <Root>
      <Text fz={48} fw={800}>
        {title}
      </Text>
      <WordCloud width={700} height={500} data={data} />
    </Root>
  )
}

const MemoizedLikes = React.memo(Likes, (prev, next) => {
  return prev.archive.interactions.length === next.archive.interactions.length
})

export default MemoizedLikes
