import React from 'react'
import { NetworkChecker } from '@modules/network/NetworkChecker'
import { Wrapper } from './elements'

export class OfflineIndicator extends React.Component {
  render() {
    return (
      <Wrapper>
        <NetworkChecker>
          {({ isOnline }) => (isOnline ? null : 'Your network is unavailable.')}
        </NetworkChecker>
      </Wrapper>
    )
  }
}
