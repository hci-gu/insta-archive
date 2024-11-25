import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Button, Checkbox, Flex, Loader, Space, Text } from '@mantine/core'
import { stripArchive } from 'insta-archive-hook'
import pako from 'pako'

const Root = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* justify-content: space-around; */
`

const DescriptionContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const ShareData = ({ archive }) => {
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const onClick = async () => {
    setLoading(true)
    const dataToUpload = stripArchive(archive)
    const compressedData = pako.gzip(JSON.stringify(dataToUpload))

    // upload to localhost:3000/upload
    await fetch('http://localhost:8090/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Encoding': 'gzip',
      },
      body: compressedData,
    })
    setLoading(false)
  }

  return (
    <>
      <Root>
        <Flex direction="column" w="50%" align="center">
          <Text fz={36} fw={800}>
            Dela med dig av din data
          </Text>
          <Text fz={24} fw={300}>
            Hittills har du bara sett din data, men du kan även välja att dela
            med dig av delar för att vara med i en studie. Inge
          </Text>
        </Flex>
        <Space h={48} />
        <DescriptionContainer>
          <div>
            <Text fz={36} fw={800}>
              Det här laddas upp
            </Text>
            <ul>
              <li>Tidsstämplar för inlägg</li>
              <li>Tidsstämplar för kommentarer</li>
              <li>Tidsstämplar för likes</li>
              <li>Tidsstämplar för DMs</li>
            </ul>
          </div>
          <div>
            <Text fz={36} fw={800}>
              Det här laddas INTE upp
            </Text>
            <ul>
              <li>Ditt användarnamn / personlig identifierare</li>
              <li>Bilder</li>
              <li>Text från inlägg</li>
              <li>Text från kommentarer</li>
              <li>Text från DMs</li>
            </ul>
          </div>
        </DescriptionContainer>
        <Space h={48} />
        <Flex align="center">
          <Checkbox
            checked={accepted}
            onChange={(e) => setAccepted(e.currentTarget.checked)}
          />
          <Space w={8} />
          <Text fz={16} fw={300}>
            Jag godkänner att min data används i en studie
          </Text>
        </Flex>
        <Space h={16} />
        <Button onClick={onClick} disabled={loading || !accepted}>
          {loading && <Loader size={16} />}
          {loading && <Space w={8} />}
          Dela din data
        </Button>
      </Root>
    </>
  )
}

export default ShareData
