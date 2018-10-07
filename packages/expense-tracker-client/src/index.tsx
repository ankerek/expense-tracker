import * as React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router } from 'react-router-dom'
import { client } from '@utils/initializeApollo'
import { ThemeProvider } from '@core-components/ThemeProvider'
import { Routes } from '@pages/Routes'

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </Router>
  </ApolloProvider>
)

render(<App />, document.getElementById('root'))
