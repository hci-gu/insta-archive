import moment from 'moment'
import { arc, curveBasis } from 'd3-shape'
import { scaleLinear, scaleTime } from '@visx/scale'
import { Bar, Line, LinePath } from '@visx/shape'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { useCurrentFrame } from 'remotion'
import { useTooltip } from '@visx/tooltip'
import { localPoint } from '@visx/event'
import { bisector, extent } from '@visx/vendor/d3-array'
import React, { act, useMemo } from 'react'
import styled from '@emotion/styled'

const SENT_COLOR = '#C03221'
const RECEIVED_COLOR = '#545E75'

const dataToBuckets = (data, type) => {
  const buckets = data.reduce((acc, curr) => {
    const time = curr.timestamp
    // round to week
    const key = moment(time).startOf('month').valueOf()
    if (!acc[key]) {
      acc[key] = {
        value: 0,
        date: time,
      }
    }
    if (type && curr.type == type) {
      acc[key].value++
    }
    if (!type) {
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
        <div style={{ background: SENT_COLOR }}></div> Skickade
      </span>
      <span>
        <div style={{ background: RECEIVED_COLOR }}></div> Mottagna
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
  const username = archive.profile.name
  const sentDms = archive.directMessages.filter((o) => o.sender === username)
  const receivedDms = archive.directMessages.filter(
    (o) => o.sender !== username
  )
  const sentDMBuckets = dataToBuckets(sentDms)
  const receivedDMBuckets = dataToBuckets(receivedDms)
  const buckets = dataToBuckets([...sentDms, ...receivedDms])

  const { width, height } = size

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [padding, width - padding],
        domain: extent(buckets, (d) => d.time),
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

  return (
    <div style={{ position: 'relative' }}>
      <Legend />
      <svg width={width} height={height}>
        <LinePath
          stroke={SENT_COLOR}
          strokeWidth={2}
          data={sentDMBuckets}
          x={(d) => dateScale(d.date)}
          y={(d) => yScale(d.value)}
          curve={curveBasis}
        />
        <LinePath
          stroke={RECEIVED_COLOR}
          strokeWidth={2}
          data={receivedDMBuckets}
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

export default LineChart