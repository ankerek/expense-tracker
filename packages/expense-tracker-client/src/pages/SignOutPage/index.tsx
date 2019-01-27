import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { Redirect } from 'react-router'

class C extends React.Component<WithApolloClient<{}>> {
  componentDidMount() {
    localStorage.removeItem('jwtToken')
    this.props.client.resetStore()
  }

  render() {
    return <Redirect to="/signin" />
  }
}

export const SignOutPage = withApollo(C)
