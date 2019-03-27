import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = new HttpLink({
  uri: '/graphql',
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? `wss://${window.location.hostname}`
      : 'ws://localhost:3000',
  options: {
    reconnect: true,
  },
})

export const terminatingLink = split(
  ({ query }) => {
    const { kind, operation }: any = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)
