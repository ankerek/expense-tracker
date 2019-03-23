import '@babel/polyfill'
import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { client, waitForCache } from '@apollo/initializeApollo'
import { registerServiceWorker } from './registerServiceWorker'
import { restoreLocalOperations } from '@controllers/network/localOperations'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { offlineLink } from '@apollo/offlineLink'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router } from 'react-router-dom'
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
  const isOnlineData = client.readQuery({ query: getIsOnlineQuery })
  if (!isOnlineData.isOnline) {
    offlineLink.close()
  }

  restoreLocalOperations(client)
  ReactDOM.render(<App />, document.getElementById('root'))
})

registerServiceWorker()
