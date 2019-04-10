import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { offlineLink } from '@apollo/links/offlineLink'
import {
  GetIsOnline,
  GetIsOnlineProps,
  getIsOnlineQuery,
} from '@modules/network/GetIsOnline'

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

type NetworkCheckerProps = GetIsOnlineProps

class C extends React.Component<WithApolloClient<NetworkCheckerProps>, State> {
  readonly state = initialState
  pollingId?: any

  componentDidMount() {
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)

    // there is a case when device is connected to network without internet
    // online/offline events count recognize it, so we need to fallback to polling
    this.pollingId = setInterval(() => {
      ping().then(online => {
        online ? this.handleOnline() : this.handleOffline()
      })
    }, INTERVAL)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)

    clearInterval(this.pollingId)
  }

  render() {
    return <GetIsOnline>{this.props.children}</GetIsOnline>
  }

  private handleUpdateOnline = (isOnline: boolean) => {
    const data = this.props.client.readQuery({
      query: getIsOnlineQuery,
    })

    if (data.isOnline !== isOnline) {
      this.props.client.writeQuery({
        query: getIsOnlineQuery,
        data: {
          isOnline,
        },
      })
    }
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

export const NetworkChecker = withApollo(C)
