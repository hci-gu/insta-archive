import React from 'react'
import styled from '@emotion/styled'
import { Button, Space, Text } from '@mantine/core'

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
  return (
    <>
      <Root>
        <Text fz={36} fw={800}>
          Dela med dig av din data
        </Text>
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
        <Button>Dela din data</Button>
      </Root>
    </>
  )
}

export default ShareData
