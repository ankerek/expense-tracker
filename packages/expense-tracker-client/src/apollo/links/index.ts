import { from as apolloLinkFrom } from 'apollo-link'
import { authLink } from '@apollo/links/authLink'
import { retryLink } from '@apollo/links/retryLink'
import { offlineLink } from '@apollo/links/offlineLink'
import { localOperationsLink } from '@apollo/links/localOperationsLink'
import { errorLink } from '@apollo/links/errorLink'
import { terminatingLink } from '@apollo/links/terminatingLink'

export const links = apolloLinkFrom([
  authLink,
  retryLink,
  offlineLink,
  localOperationsLink,
  errorLink,
  terminatingLink,
])
