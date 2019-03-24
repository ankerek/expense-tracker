import '@babel/polyfill'
import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { client, waitForCache } from '@apollo/initializeApollo'
import { registerServiceWorker } from './registerServiceWorker'
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
  ReactDOM.render(<App />, document.getElementById('root'))
})

registerServiceWorker()
