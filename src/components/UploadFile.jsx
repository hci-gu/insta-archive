import styled from '@emotion/styled'
import React from 'react'
import { Group, Text, rem } from '@mantine/core'
import { IconUpload, IconPhoto, IconArchive, IconX } from '@tabler/icons-react'
import { Dropzone } from '@mantine/dropzone'
import { useSetAtom } from 'jotai'
import { fileAtom } from '../state'

const Container = styled.div`
  margin: 0 auto;
  margin-top: 64px;
  width: 600px;
  height: 200px;
`

const UploadFile = () => {
  const setFile = useSetAtom(fileAtom)

  return (
    <Container>
      <Dropzone
        onDrop={(files) => setFile(files[0])}
        maxSize={500 * 1024 * 1024 ** 2}
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
                color: 'var(--mantine-color-blue-6)',
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
            <IconArchive
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-dimmed)',
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drop your archive here
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Make sure its a zip file
            </Text>
          </div>
        </Group>
      </Dropzone>
    </Container>
  )
}

export default UploadFile
