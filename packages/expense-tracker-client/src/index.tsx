import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router } from 'react-router-dom'
import { client, waitForCache } from '@utils/initializeApollo'
import { ThemeProvider } from '@core-components/ThemeProvider'
import { OfflineIndicator } from '@core-components/OfflineIndicator'
import { Routes } from '@pages/Routes'

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <ThemeProvider>
        <OfflineIndicator />
        <Routes />
      </ThemeProvider>
    </Router>
  </ApolloProvider>
)

waitForCache.then(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
})
