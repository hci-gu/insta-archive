import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Group, Loader, Space, Text, rem } from '@mantine/core'
import { IconUpload, IconArchive, IconX } from '@tabler/icons-react'
import { Dropzone } from '@mantine/dropzone'

const Container = styled.div`
  margin: 0 auto;
  margin-top: 128px;
  width: 700px;
  height: 200px;
`

const UploadFile = ({ setFile }) => {
  const [loading, setLoading] = useState(false)

  return (
    <Container>
      <Text align="center" fz={32} fw={700}>
        Verktyget för att se din Instagram data
      </Text>
      <Text align="center" fz={18} fw={300}>
        Genom att lägga in ditt arkiv kan du se din aktivitet på Instagram,
        inget laddas upp i det här steget. Du får valet att dela med dig av ett
        urval av din data senare. Inga bilder/texter/innehåll i sig laddas
        någonsin upp även om du väljer att dela.
      </Text>
      <Space h={64} />

      <Dropzone
        bg="transparent"
        onDrop={(files) => {
          setLoading(true)
          setFile(files[0])
        }}
        maxSize={500 * 1024 * 1024 ** 2}
        style={{
          border: '3px dashed black',
        }}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: 'black',
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-red-6)',
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            {loading && <Loader />}
            {!loading && (
              <IconArchive
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'black',
                }}
                stroke={1.5}
              />
            )}
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              {loading
                ? 'Laddar din data...'
                : 'Dra och släpp för att läsa in din data'}
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Det ska vara en .zip fil
            </Text>
          </div>
        </Group>
      </Dropzone>
    </Container>
  )
}

export default UploadFile
