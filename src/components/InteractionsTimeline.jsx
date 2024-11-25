import moment from 'moment'
import { curveBasis } from 'd3-shape'
import { scaleLinear, scaleTime } from '@visx/scale'
import { LinePath } from '@visx/shape'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { extent } from '@visx/vendor/d3-array'
import { useMemo } from 'react'
import styled from '@emotion/styled'
import { dataToBuckets } from '../utils'

const POSTS_LIKES_COLOR = '#545E75'
const STORY_LIKES_COLOR = '#C03221'
const COMMENTS_COLOR = '#7EA16B'

const LegendWrapper = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;

  display: flex;
  flex-direction: column;
  /* align-items: end; */

  > span {
    font-size: 14px;
  }

  > span > div {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 2px;
    border-radius: 4px;
  }
`

const Legend = () => {
  return (
    <LegendWrapper>
      <span>
        <div style={{ background: POSTS_LIKES_COLOR }}></div> Inlägg du gillat
      </span>
      <span>
        <div style={{ background: STORY_LIKES_COLOR }}></div> Stories du gillat
      </span>
      <span>
        <div style={{ background: COMMENTS_COLOR }}></div> Kommentarer du
        skrivit
      </span>
    </LegendWrapper>
  )
}

const LikesTimeline = ({
  archive,
  size = { width: 600, height: 400 },
  padding = 48,
  playerRef,
}) => {
  const buckets = dataToBuckets(archive.interactions)
  const postLikes = archive.interactions.filter(
    (o) => o.type == 'Like' && o.onType == 'Post'
  )
  const storyLikes = archive.interactions.filter(
    (o) => o.type == 'Like' && o.onType == 'Story'
  )
  const postLikesBuckets = dataToBuckets(postLikes)
  const storyLikesBuckets = dataToBuckets(storyLikes)
  const commentBuckets = dataToBuckets(archive.interactions, 'Comment')

  const { width, height } = size

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [padding, width - padding],
        domain: extent(buckets, (d) => d.date),
      }),
    [width, padding, buckets]
  )
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [height - padding, padding],
        domain: extent(buckets, (d) => d.value),
      }),
    [height, buckets]
  )

  return (
    <div style={{ position: 'relative' }}>
      <Legend />
      <svg width={width} height={height}>
        <LinePath
          stroke={POSTS_LIKES_COLOR}
          strokeWidth={2}
          data={postLikesBuckets}
          x={(d) => dateScale(d.date)}
          y={(d) => yScale(d.value)}
          curve={curveBasis}
        />
        <LinePath
          stroke={STORY_LIKES_COLOR}
          strokeWidth={2}
          data={storyLikesBuckets}
          x={(d) => dateScale(d.date)}
          y={(d) => yScale(d.value)}
          curve={curveBasis}
        />

        <LinePath
          stroke={COMMENTS_COLOR}
          strokeWidth={2}
          data={commentBuckets}
          x={(d) => dateScale(d.date)}
          y={(d) => yScale(d.value)}
          curve={curveBasis}
        />
        <AxisBottom
          scale={dateScale}
          top={height - padding + 4}
          numTicks={12}
          stroke="#333"
          tickFormat={(d) => moment(d).format('YYYY-MM-DD')}
          tickLabelProps={() => ({
            fill: '#333',
            fontSize: 14,
            textAnchor: 'middle',
          })}
        />
        <AxisLeft
          scale={yScale}
          left={padding}
          numTicks={5}
          stroke="#333"
          tickLabelProps={() => ({
            fill: '#333',
            fontSize: 18,
            textAnchor: 'end',
            dx: '-0.25em',
            dy: '0.25em',
          })}
        />
      </svg>
    </div>
  )
}

export default LikesTimeline
