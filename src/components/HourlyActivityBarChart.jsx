import React, { useMemo, useState } from 'react'
import { Bar } from '@visx/shape'
import { scaleBand, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import moment from 'moment'
import { Flex, Select, Slider } from '@mantine/core'

const BAR_COLOR = '#4CAF50'

const calculateHourlyData = (data) => {
  const hourlyCounts = Array(24).fill(0)

  data.forEach((item) => {
    const hour = moment(item.timestamp).hour()
    hourlyCounts[hour]++
  })

  return hourlyCounts.map((count, hour) => ({
    hour,
    value: count,
  }))
}

const HourlyActivityBarChart = ({
  archive,
  size = { width: 600, height: 400 },
  padding = 48,
}) => {
  const [selectedData, setSelectedData] = useState('activities')
  const [subFilter, setSubFilter] = useState('all')
  const [dayTypeFilter, setDayTypeFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  const data = useMemo(() => {
    const filteredData = archive[selectedData]
      .filter((item) => (subFilter === 'all' ? true : item.type === subFilter))
      .filter((item) => {
        const dayOfWeek = moment(item.timestamp).day()
        return dayTypeFilter === 'all'
          ? true
          : dayTypeFilter === 'weekday'
          ? dayOfWeek >= 1 && dayOfWeek <= 5
          : dayOfWeek === 0 || dayOfWeek === 6
      })
      .filter((item) =>
        yearFilter === 'all'
          ? true
          : moment(item.timestamp).year() === parseInt(yearFilter)
      )

    return calculateHourlyData(filteredData)
  }, [selectedData, subFilter, dayTypeFilter, yearFilter, archive])

  const { width, height } = size

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [padding, width - padding],
        domain: data.map((d) => d.hour),
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
          { value: 'Like', label: 'Gilla' },
        ]

  const dayTypeOptions = [
    { value: 'all', label: 'Alla' },
    { value: 'weekday', label: 'Vardag' },
    { value: 'weekend', label: 'Helg' },
  ]

  const yearOptions = [
    { value: 'all', label: 'Alla år' },
    ...Array.from(
      new Set(
        archive[selectedData].map((item) => moment(item.timestamp).year())
      )
    ).map((year) => ({ value: year.toString(), label: year.toString() })),
  ]

  return (
    <div style={{ position: 'relative' }}>
      <Flex gap={4}>
        <Select
          value={selectedData}
          onChange={(value) => {
            setSelectedData(value)
            setSubFilter('all') // Reset subFilter when switching main selection
          }}
          data={[
            { value: 'activities', label: 'Inlägg och stories' },
            { value: 'interactions', label: 'Kommentarer och likes' },
          ]}
          style={{ marginBottom: '20px', width: '200px' }}
        />
        <Select
          value={subFilter}
          onChange={setSubFilter}
          data={subOptions}
          style={{ marginBottom: '20px', width: '200px' }}
        />
        <Select
          value={dayTypeFilter}
          onChange={setDayTypeFilter}
          data={dayTypeOptions}
          style={{ marginBottom: '20px', width: '200px' }}
        />
        <Slider
          w={200}
          value={parseInt(yearFilter)}
          onChange={(value) => setYearFilter(value.toString())}
          min={2000}
          max={2024}
        />

        <Select
          value={yearFilter}
          onChange={setYearFilter}
          data={yearOptions}
          style={{ marginBottom: '20px', width: '200px' }}
        />
      </Flex>
      <svg width={width} height={height}>
        {data.map((d) => (
          <Bar
            key={d.hour}
            x={xScale(d.hour)}
            y={yScale(d.value)}
            width={xScale.bandwidth()}
            height={height - padding - yScale(d.value)}
            fill={BAR_COLOR}
          />
        ))}
        <AxisBottom
          scale={xScale}
          top={height - padding + 4}
          stroke="#333"
          tickFormat={(hour) => `${hour}:00`}
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

export default HourlyActivityBarChart
