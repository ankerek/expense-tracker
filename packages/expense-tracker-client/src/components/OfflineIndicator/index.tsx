import React from 'react'
import { NetworkChecker } from '@modules/network/NetworkChecker'
import { Wrapper } from './elements'

export class OfflineIndicator extends React.Component {
  render() {
    return (
      <NetworkChecker>
        {({ isOnline }) =>
          isOnline ? null : <Wrapper>Your network is unavailable.</Wrapper>
        }
      </NetworkChecker>
    )
  }
}
