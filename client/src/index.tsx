import * as React from 'react'
import { render } from 'react-dom'
import ApolloClient from 'apollo-client'
import * as ApolloLink from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@core-components/ThemeProvider'
import { PageLayout } from '@core-components/PageLayout'
import { Routes } from "@pages/Routes";

const API_BASE_URL = '/graphql'

const httpLink = new HttpLink({
  uri: API_BASE_URL,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: { ...headers, Authorization: token ? `Bearer ${token}` : '' },
  }
})

const link = ApolloLink.from([authLink, httpLink])

const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache,
})

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
