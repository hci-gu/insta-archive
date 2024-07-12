import styled from '@emotion/styled'
import { Card, Center, SimpleGrid, Text } from '@mantine/core'
import AnimatedNumbers from 'react-animated-numbers'
import moment from 'moment'

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
    line-height: 1;
  }
  > span {
    font-size: 18px;
    font-weight: 200;
  }
`

const Stat = ({ value, text }) => {
  return (
    <StatCard shadow="sm" withBorder>
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

  return (
    <Root>
      <Text fz={32} fw={300}>
        Du skapade ditt konto{' '}
        <strong>{moment(archive.startDate).format('YYYY-MM-DD')}</strong>.
      </Text>
      <SimpleGrid cols={3} w={'50%'} m={'32px auto'} spacing="md">
        <Stat value={postCount} text="Inlägg" />
        <Stat value={storiesCount} text="Stories" />
        <Stat value={likesCount} text="Gillade inlägg" />
        <Stat value={commentLikeCount} text="Gillade kommentarer" />
        <Stat value={comments} text="Kommentarer" />

        {Array.from({ length: 1 }).map((_, i) => (
          <StatCard shadow="sm" withBorder key={`Griditem_${i}`}>
            <strong>X</strong>
            <span>Något</span>
          </StatCard>
        ))}
      </SimpleGrid>
    </Root>
  )
}

export default Introduction
