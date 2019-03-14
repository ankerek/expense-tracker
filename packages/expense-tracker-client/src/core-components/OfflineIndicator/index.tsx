import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { offlineLink } from '@apollo/offlineLink'
import { Wrapper } from './elements'
import { GetIsOnline, getIsOnlineQuery } from '@controllers/network/GetIsOnline'

const URL = 'https://ipv4.icanhazip.com/'
const TIMEOUT = 5000
const INTERVAL = 5000

const ping = () => {
  return new Promise(resolve => {
    const isOnline = () => resolve(true)
    const isOffline = () => resolve(false)

    const xhr = new XMLHttpRequest()

    xhr.onerror = isOffline
    xhr.ontimeout = isOffline
    xhr.onload = () => {
      const response = xhr.responseText.trim()
      if (!response) {
        isOffline()
      } else {
        isOnline()
      }
    }

    xhr.open('GET', URL)
    xhr.timeout = TIMEOUT
    xhr.send()
  })
}

const initialState = {
  online: true,
}

type State = Readonly<typeof initialState>

class C extends React.Component<WithApolloClient<any>, State> {
  readonly state = initialState
  pollingId?: any

  componentDidMount() {
    this.pollingId = setInterval(() => {
      ping().then(online => {
        online ? this.handleOnline() : this.handleOffline()
      })
    }, INTERVAL)
  }

  componentWillUnmount() {
    clearInterval(this.pollingId)
  }

  render() {
    return (
      <Wrapper>
        <GetIsOnline>
          {({ data: { isOnline } }) =>
            isOnline ? null : 'Your network is unavailable.'
          }
        </GetIsOnline>
      </Wrapper>
    )
  }

  private handleUpdateOnline = (isOnline: boolean) => {
    this.props.client.writeQuery({
      query: getIsOnlineQuery,
      data: {
        isOnline,
      },
    })
  }

  private handleOnline = () => {
    offlineLink.open()
    this.handleUpdateOnline(true)
  }

  private handleOffline = () => {
    offlineLink.close()
    this.handleUpdateOnline(false)
  }
}

export const OfflineIndicator = withApollo(C)
