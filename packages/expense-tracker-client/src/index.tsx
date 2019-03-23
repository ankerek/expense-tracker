import '@babel/polyfill'
import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router } from 'react-router-dom'
import { client, waitForCache } from '@apollo/initializeApollo'
import { registerServiceWorker } from './registerServiceWorker'
import { ThemeProvider } from '@core-components/ThemeProvider'
import { OfflineIndicator } from '@core-components/OfflineIndicator'
import { Routes } from '@pages/Routes'
import { restoreLocalOperations } from '@controllers/network/localOperations'

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
  restoreLocalOperations(client)
  ReactDOM.render(<App />, document.getElementById('root'))
})

registerServiceWorker()
