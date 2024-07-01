import moment from 'moment'
import { curveBasis } from 'd3-shape'
import { scaleBand, scaleLinear } from '@visx/scale'
import { Group } from '@visx/group'
import { Bar, Line, LinePath } from '@visx/shape'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { useCurrentFrame } from 'remotion'
// import { Grid } from '@visx/grid'

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
    // round to week
    const key = moment(time).startOf('month').valueOf()
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

const LineChart = ({ archive, size = { width: 600, height: 400 } }) => {
  const frame = useCurrentFrame()
  const currentTimestamp = archive.activities[frame].timestamp

  const padding = 48
  const { width, height } = size

  const posts = archive.activities.filter(
    (activity) => activity.type === 'Post'
  )
  const stories = archive.activities.filter(
    (activity) => activity.type === 'Story'
  )

  const buckets = postsToBuckets(archive.activities)

  const xScale = scaleLinear({
    range: [padding, width - padding],
    domain: extent(buckets, (d) => d.date.valueOf()),
  })

  const yScale = scaleLinear({
    range: [height - padding, padding],
    domain: extent(buckets, (d) => d.value),
  })

  return (
    <svg
      width={'100%'}
      height={height}
      style={{
        // border: '1px solid black',
        position: 'absolute',
        bottom: '0',
        zIndex: -1,
      }}
    >
      <Line
        from={{ x: xScale(currentTimestamp), y: padding }}
        to={{ x: xScale(currentTimestamp), y: height - padding }}
        stroke="#333"
        strokeWidth={2}
      />
      {/* <Grid
        top={padding}
        left={padding}
        xScale={xScale}
        yScale={yScale}
        width={width - padding * 2}
        height={height - padding * 2}
        strokeDasharray="3,3"
        stroke="gray"
      /> */}
      <LinePath
        stroke="#0F0F0F"
        strokeWidth={1.5}
        data={buckets}
        x={(d) => xScale(d.date.valueOf())}
        y={(d) => yScale(d.value)}
        curve={curveBasis}
      />
      {/* <LinePath
        stroke="#333"
        strokeWidth={2}
        data={storyBuckets}
        x={(d) => xScale(d.date.valueOf())}
        y={(d) => yScale(d.value)}
        curve={curveBasis}
      /> */}
      <AxisBottom
        scale={xScale}
        top={height - padding}
        numTicks={12}
        stroke="#333"
        tickFormat={(d) => moment(d).format('YYYY-MM-DD')}
        tickLabelProps={() => ({
          fill: '#333',
          fontSize: 12,
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
          fontSize: 12,
          textAnchor: 'end',
          dx: '-0.25em',
          dy: '0.25em',
        })}
      />
    </svg>
  )
}

export default LineChart
