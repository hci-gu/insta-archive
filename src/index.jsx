import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import App from './App'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import './index.css'

const Root = () => {
  return (
    <MantineProvider
      theme={{
        // fontFamily: 'Public Sans, sans-serif',
        fontFamily: '"Noto Sans", sans-serif',
      }}
    >
      <App />
    </MantineProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
