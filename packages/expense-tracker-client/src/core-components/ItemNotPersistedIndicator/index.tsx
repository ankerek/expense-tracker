import React from 'react'
import OfflineIcon from '@material-ui/icons/OfflineBolt'
import Tooltip from '@material-ui/core/Tooltip'

export class ItemNotPersistedIndicator extends React.PureComponent {
  render() {
    return (
      <Tooltip title="Content will be saved on network connection">
        <OfflineIcon />
      </Tooltip>
    )
  }
}
