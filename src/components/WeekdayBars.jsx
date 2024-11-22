import React, { useMemo, useState } from 'react'
import { Bar } from '@visx/shape'
import { scaleBand, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import moment from 'moment'
import { Flex, Select } from '@mantine/core'

const WEEKDAY_COLOR = '#545E75'
const WEEKEND_COLOR = '#C03221'

// Mapping weekdays to numbers, Monday = 1, Sunday = 7
const weekdayMap = {
  1: 'Måndag',
  2: 'Tisdag',
  3: 'Onsdag',
  4: 'Torsdag',
  5: 'Fredag',
  6: 'Lördag',
  7: 'Söndag',
}

const calculateWeekdayData = (data, filter) => {
  const filteredData =
    filter && filter !== 'all'
      ? data.filter((item) => item.type === filter)
      : data

  const weekdayCounts = filteredData.reduce((acc, curr) => {
    const dayNumber = moment(curr.timestamp).isoWeekday() // Monday = 1, Sunday = 7
    acc[dayNumber] = (acc[dayNumber] || 0) + 1
    return acc
  }, {})

  return Object.keys(weekdayMap).map((dayNumber) => ({
    day: weekdayMap[dayNumber],
    value: weekdayCounts[dayNumber] || 0,
    isWeekend: dayNumber >= 6, // Saturday and Sunday are weekends
  }))
}

const WeekdayBarChart = ({
  archive,
  size = { width: 600, height: 400 },
  padding = 48,
}) => {
  const [selectedData, setSelectedData] = useState('activities')
  const [subFilter, setSubFilter] = useState('all')

  const data = useMemo(() => {
    if (selectedData === 'activities') {
      return calculateWeekdayData(archive.activities, subFilter)
    } else {
      return calculateWeekdayData(archive.interactions, subFilter)
    }
  }, [selectedData, subFilter, archive.activities, archive.interactions])

  const { width, height } = size

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [padding, width - padding],
        domain: data.map((d) => d.day),
        padding: 0.4,
      }),
    [data, width, padding]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [height - padding, padding],
        domain: [0, Math.max(...data.map((d) => d.value))],
      }),
    [data, height, padding]
  )

  const subOptions =
    selectedData === 'activities'
      ? [
          { value: 'all', label: 'Alla' },
          { value: 'Post', label: 'Inlägg' },
          { value: 'Story', label: 'Stories' },
        ]
      : [
          { value: 'all', label: 'Alla' },
          { value: 'Comment', label: 'Kommentarer' },
          { value: 'Like', label: 'Likes' },
        ]

  return (
    <div style={{ position: 'relative' }}>
      <Flex gap="sm">
        <Select
          value={selectedData}
          onChange={(value) => {
            setSelectedData(value)
            setSubFilter('all') // Reset subFilter when switching main selection
          }}
          data={[
            { value: 'activities', label: 'Inlägg och stories' },
            {
              value: 'interactions',
              label: 'Likes och kommenterar',
            },
          ]}
          style={{
            marginBottom: '20px',
            width: '200px',
            background: '#F0E0BC',
          }}
        />
        <Select
          value={subFilter}
          onChange={setSubFilter}
          data={subOptions}
          style={{ marginBottom: '20px', width: '200px' }}
        />
      </Flex>
      <svg width={width} height={height}>
        {data.map((d) => (
          <Bar
            key={d.day}
            x={xScale(d.day)}
            y={yScale(d.value)}
            width={xScale.bandwidth()}
            height={height - padding - yScale(d.value)}
            fill={d.isWeekend ? WEEKEND_COLOR : WEEKDAY_COLOR}
          />
        ))}
        <AxisBottom
          scale={xScale}
          top={height - padding + 4}
          stroke="#333"
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
            fontSize: 14,
            textAnchor: 'end',
            dx: '-0.25em',
            dy: '0.25em',
          })}
        />
      </svg>
    </div>
  )
}

export default WeekdayBarChart
