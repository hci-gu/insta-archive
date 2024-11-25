import moment from 'moment'
import { arc, curveBasis, curveBumpX, curveBundle } from 'd3-shape'
import { scaleLinear, scaleTime } from '@visx/scale'
import { Bar, Line, LinePath } from '@visx/shape'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { useCurrentFrame } from 'remotion'
import { useTooltip } from '@visx/tooltip'
import { localPoint } from '@visx/event'
import { bisector, extent } from '@visx/vendor/d3-array'
import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { dataToBuckets } from '../utils'

const STORIES_COLOR = '#C03221'
const POSTS_COLOR = '#545E75'

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
        <div style={{ background: POSTS_COLOR }}></div> Inlägg
      </span>
      <span>
        <div style={{ background: STORIES_COLOR }}></div> Stories
      </span>
    </LegendWrapper>
  )
}

const LineChart = ({
  archive,
  size = { width: 600, height: 400 },
  padding = 48,
  playerRef,
}) => {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip()

  const frame = useCurrentFrame()
  const activePost =
    showTooltip && tooltipLeft > 0 ? archive.activities[frame] : null
  const postsBuckets = dataToBuckets(archive.activities, 'Post')
  const storiesBuckets = dataToBuckets(archive.activities, 'Story')
  const buckets = dataToBuckets(archive.activities)
  const bisectDate = bisector((d) => new Date(d.timestamp)).left

  const { width, height } = size

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [padding, width - padding],
        domain: extent(archive.activities, (d) => d.timestamp),
      }),
    [width, padding]
  )
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [height - padding, padding],
        domain: extent(buckets, (d) => d.value),
      }),
    [height, buckets]
  )

  const handleMouseOver = (event, datum) => {
    const { x } = localPoint(event.target.ownerSVGElement, event) || { x: 0 }
    const x0 = dateScale.invert(x)
    const index = bisectDate(archive.activities, x0, 1)

    if (playerRef.current) {
      playerRef.current.seekTo(index)
    }
    showTooltip({
      tooltipLeft: x,
      tooltipData: datum,
    })
  }

  let storyOpacity =
    activePost && activePost.type == 'Story' ? 1 : activePost ? 0.3 : 1
  let postOpacity =
    activePost && activePost.type == 'Post' ? 1 : activePost ? 0.3 : 1

  return (
    <div style={{ position: 'relative' }}>
      <Legend />
      <svg width={width} height={height}>
        {showTooltip && tooltipLeft > 0 && (
          <Line
            from={{ x: tooltipLeft, y: padding }}
            to={{ x: tooltipLeft, y: height - padding }}
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth={2}
            strokeDasharray="5,2"
          />
        )}
        <LinePath
          stroke="#C03221"
          strokeWidth={2}
          data={storiesBuckets}
          opacity={storyOpacity}
          x={(d) => dateScale(d.date)}
          y={(d) => yScale(d.value)}
          curve={curveBundle}
        />
        {/* <LinePath
          stroke="#E45E75"
          strokeWidth={2}
          data={directMessages}
          opacity={storyOpacity}
          x={(d) => dateScale(d.date)}
          y={(d) => yScale(d.value)}
          curve={curveBasis}
        /> */}
        <LinePath
          stroke="#545E75"
          strokeWidth={2}
          opacity={postOpacity}
          data={postsBuckets}
          x={(d) => dateScale(d.date)}
          y={(d) => yScale(d.value)}
          curve={curveBundle}
        />
        <Bar
          x={padding}
          y={0}
          width={width - padding * 2}
          height={height}
          fill="transparent"
          rx={14}
          onMouseMove={handleMouseOver}
          onMouseLeave={() => hideTooltip()}
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

export default LineChart
