import React, { useMemo } from 'react'
import { Text } from '@visx/text'
import { scaleLog } from '@visx/scale'
import VisXWordcloud from '@visx/wordcloud/lib/Wordcloud'

const colors = ['#143059', '#2F6B9A', '#add9fa']

function wordFreq(text) {
  const words = text.replace(/\./g, '').split(/\s/)
  const freqMap = {}

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0
    freqMap[w] += 1
  }
  return Object.keys(freqMap).map((word) => ({
    text: word,
    value: freqMap[word],
  }))
}

const fixedValueGenerator = () => 0.5

export default function WordCloud({ width, height, data }) {
  const words = useMemo(() => wordFreq(data), [])

  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  })

  const fontSizeSetter = (datum) => fontScale(datum.value)

  return (
    <div className="wordcloud">
      <VisXWordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={2}
        rotate={0}
        spiral={'archimedean'}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </VisXWordcloud>
      <style jsx>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
    </div>
  )
}
