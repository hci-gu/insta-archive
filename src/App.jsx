// file:///Users/sebastianandreasson/Documents/Tester%20med%20min%20egen%20data/instagram-beata_j-2024-03-07-2Lvo0rP9/your_instagram_activity/content/posts_1.html

import styled from '@emotion/styled'
import React from 'react'
import DarkModeToggle from './components/DarkModeToggle'
import { AppShell, Flex, Space, Text, Title } from '@mantine/core'
import UploadFile from './components/UploadFile'
import { useAtomValue } from 'jotai'
import { folderDataAtom, htmlDataAtom, htmlHistoryDataAtom } from './state'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import { unwrap } from 'jotai/utils'
import moment from 'moment'
import { scaleBand, scaleLinear } from '@visx/scale'
import { Group } from '@visx/group'
import { Bar, LinePath } from '@visx/shape'
import { AxisBottom } from '@visx/axis'

const extractDates = (data) => {
  const uniqueDates = [...new Set(data)]
  return uniqueDates.sort()
}

function extent(values, valueof) {
  let min
  let max
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null) {
        if (min === undefined) {
          if (value >= value) min = max = value
        } else {
          if (min > value) min = value
          if (max < value) max = value
        }
      }
    }
  } else {
    let index = -1
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null) {
        if (min === undefined) {
          if (value >= value) min = max = value
        } else {
          if (min > value) min = value
          if (max < value) max = value
        }
      }
    }
  }
  return [min, max]
}

const postsToBuckets = (posts) => {
  const buckets = posts.reduce((acc, curr) => {
    const time = curr.timestamp
    const key = moment(curr.timestamp).format('YYYY-MM-DD')
    if (!acc[key]) {
      acc[key] = {
        value: 1,
        date: time,
      }
    } else {
      acc[key].value++
    }
    return acc
  }, {})

  return Object.keys(buckets)
    .map((time) => ({
      time,
      date: buckets[time].date,
      value: buckets[time].value,
    }))
    .sort((a, b) => a.date - b.date)
}

const formatDate = (date) => moment(date).format('YYYY-MM-DD')

const Interactions = () => {
  const likes = useAtomValue(
    unwrap(htmlDataAtom(['likes', 'liked_posts.html']))
  )
  const commentLikes = useAtomValue(
    unwrap(htmlDataAtom(['likes', 'liked_comments.html']))
  )

  if (!likes || !commentLikes) {
    return
  }

  const data = extractDates([
    ...Object.keys(likes),
    ...Object.keys(commentLikes),
  ]).map((date) => ({
    date,
    likes: likes[date] || 0,
    commentLikes: commentLikes[date] || 0,
  }))

  return (
    <div style={{ marginTop: 100 }}>
      <Flex>
        <Flex direction="column">
          <Title>Interactions</Title>
          <Space h={16} />
          <LineChart width={1720 / 1.25} height={500} data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="commentLikes"
              stroke="#05668D"
              dot={false}
            />
            {/* <ReferenceLine x={'2017-02-22'} stroke="red" label="Max PV PAGE" /> */}
            <Line
              type="monotone"
              dataKey="likes"
              stroke="#EF5B5B"
              dot={false}
            />
            <Legend />
          </LineChart>
        </Flex>
      </Flex>
    </div>
  )
}

const FolderData = () => {
  const posts = useAtomValue(unwrap(folderDataAtom(['media', 'posts'])))
  const reels = useAtomValue(unwrap(folderDataAtom(['media', 'reels'])))
  const stories = useAtomValue(unwrap(folderDataAtom(['media', 'stories'])))
  const likes = useAtomValue(
    unwrap(htmlDataAtom(['likes', 'liked_posts.html']))
  )
  const commentLikes = useAtomValue(
    unwrap(htmlDataAtom(['likes', 'liked_comments.html']))
  )

  if (!posts || !reels || !stories || !likes || !commentLikes) {
    return
  }

  const data = extractDates([
    ...Object.keys(posts),
    ...Object.keys(reels),
    ...Object.keys(stories),
    ...Object.keys(likes),
    ...Object.keys(commentLikes),
  ]).map((date) => ({
    date,
    posts: posts[date] || 0,
    reels: reels[date] || 0,
    likes: likes[date] || 0,
    commentLikes: commentLikes[date] || 0,
    stories: stories[date] || 0,
  }))

  return (
    <div style={{ marginTop: 100 }}>
      <Flex>
        <Flex direction="column">
          <Title>Posts & Stories</Title>
          <Space h={16} />
          <LineChart width={1720 / 1.25} height={500} data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="posts"
              stroke="#05668D"
              dot={false}
            />
            <ReferenceLine x={'2017-02-22'} stroke="red" label="Max PV PAGE" />
            <Line
              type="monotone"
              dataKey="stories"
              stroke="#EF5B5B"
              dot={false}
            />
            {/* <Line
              type="monotone"
              dataKey="likes"
              stroke="#EF5B5B"
              dot={false}
            /> */}
            {/* <Line
              type="monotone"
              dataKey="reels"
              stroke="#232E21"
              dot={false}
            /> */}
            {/* <Line
              type="monotone"
              dataKey="commentLikes"
              stroke="#232E21"
              dot={false}
            /> */}
            <Legend />
          </LineChart>
        </Flex>
        {/* <Flex direction="column">
          <Title>Likes</Title>
          <Space h={16} />
          <LineChart width={1720 / 2} height={500} data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="likes"
              stroke="#EF5B5B"
              dot={false}
            />
            <Legend />
          </LineChart>
        </Flex> */}
      </Flex>
    </div>
  )
}

const PostsData = () => {
  const posts = useAtomValue(
    unwrap(
      htmlHistoryDataAtom([
        'your_instagram_activity',
        'content',
        'posts_1.html',
      ])
    )
  )

  if (!posts || !posts.length) return null

  const width = 800
  const height = 400
  const padding = 16

  const buckets = postsToBuckets(posts)

  const xScale = scaleLinear({
    range: [padding, width - padding * 2],
    domain: extent(buckets, (d) => d.date.valueOf()),
  })

  const yScale = scaleLinear({
    range: [height - padding * 2, padding],
    domain: extent(buckets, (d) => d.value),
  })

  const compose = (scale, accessor) => (data) => scale(accessor(data))
  // const xPoint = compose(xScale, x)
  // const yPoint = compose(yScale, y)
  //

  console.log(buckets)

  return (
    <svg width={width} height={height} style={{ border: '1px dotted black' }}>
      <LinePath
        stroke="#A71D31"
        strokeWidth={0.5}
        data={buckets}
        x={(d) => xScale(d.date.valueOf())}
        y={(d) => yScale(d.value)}
        // curve={curveBasis}
      />
      <AxisBottom
        scale={xScale}
        top={height - padding * 2}
        numTicks={10}
        stroke="red"
        strokeWidth={1}
        tickFormat={(d) => moment(d).format('YYYY')}
        // hideTicks
        tickLabelProps={() => ({
          fill: '#0f0f0f',
          fontSize: 11,
        })}
      />
    </svg>
  )
}

const App = () => {
  return (
    <AppShell>
      <AppShell.Header h={64} p={16}>
        <Flex align="center" justify="end">
          <DarkModeToggle />
        </Flex>
      </AppShell.Header>
      <AppShell.Main p="xl" pt={64}>
        <UploadFile />
        <FolderData />
        <Interactions />
        {/* <PostsData /> */}
      </AppShell.Main>
    </AppShell>
  )
}

export default App
