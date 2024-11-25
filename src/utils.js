import moment from 'moment'

export const dataToBuckets = (data, type) => {
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

  const returnBuckets = Object.keys(buckets)
    .map((time) => ({
      time,
      date: buckets[time].date,
      value: buckets[time].value,
    }))
    .sort((a, b) => a.date - b.date)

  const lastDate = returnBuckets[returnBuckets.length - 1].date

  returnBuckets.push({
    date: new Date(lastDate),
    time: new Date(lastDate).getTime(),
    value: 0,
  })

  return returnBuckets
}
