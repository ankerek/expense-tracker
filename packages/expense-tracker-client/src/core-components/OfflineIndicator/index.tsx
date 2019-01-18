import React from 'react'
import { Wrapper } from './elements'

const initialState = {
  online: true,
}

type State = Readonly<typeof initialState>

export class OfflineIndicator extends React.Component<{}, State> {
  readonly state = initialState

  componentDidMount() {
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
  }

  render() {
    return (
      <Wrapper>
        {this.state.online ? null : 'Your network is unavailable.'}
      </Wrapper>
    )
  }

  private handleOnline = () => {
    this.setState({
      online: true,
    })
  }

  private handleOffline = () => {
    this.setState({
      online: false,
    })
  }
}
