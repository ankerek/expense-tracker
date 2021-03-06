import React from 'react'
import { GetIsOnline } from '@modules/network/GetIsOnline'
import OfflineIcon from '@material-ui/icons/OfflineBolt'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { Wrapper } from './elements'

interface ItemNotPersistedIndicatorProps {
  compact?: boolean
}

const TEXT = 'This content will be saved on network connection'

export class ItemNotPersistedIndicator extends React.PureComponent<
  ItemNotPersistedIndicatorProps
> {
  render() {
    const { compact } = this.props

    return (
      <GetIsOnline>
        {({ data: { isOnline } }) => {
          if (isOnline) {
            return null
          }

          if (compact) {
            return (
              <Tooltip title={TEXT}>
                <OfflineIcon />
              </Tooltip>
            )
          }

          return (
            <Wrapper elevation={1}>
              <Typography component="p">{TEXT}</Typography>
            </Wrapper>
          )
        }}
      </GetIsOnline>
    )
  }
}
