import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { cachePersistor } from '@utils/initializeApollo'

interface SignOutProps {
  children: (data: { signOut: () => void }) => React.ReactNode
}

class C extends React.Component<WithApolloClient<SignOutProps>> {
  render() {
    return this.props.children({
      signOut: this.handleSignOut,
    })
  }

  private handleSignOut = () => {
    localStorage.removeItem('jwtToken')
    this.props.client.clearStore()
    cachePersistor.purge()
    location.reload()
  }
}

export const SignOut = withApollo(C)
