import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#0A0A0A',
        color: '#E0E0E0'
      }
    }
  },
  colors: {
    brand: {
      primary: '#00F5A0',
      secondary: '#00D9F5',
      dark: '#1A1A1A',
      light: '#E0E0E0'
    }
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  }
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App 