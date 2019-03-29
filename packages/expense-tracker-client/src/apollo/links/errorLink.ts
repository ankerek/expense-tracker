import { onError } from 'apollo-link-error'
import { clearClientStore } from '@apollo/initializeApollo'

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (
    graphQLErrors &&
    graphQLErrors.length &&
    graphQLErrors.find(error => error.extensions.code === 'UNAUTHENTICATED')
  ) {
    localStorage.removeItem('jwtToken')
    clearClientStore()
    location.reload()
  }
})
