import React from 'react'
import { Wrapper } from './elements'
import Typography from '@material-ui/core/Typography'

export class AppVersion extends React.PureComponent {
  render() {
    const sourceVersion = process.env.COMMIT
    return sourceVersion ? (
      <Wrapper>
        <Typography color="textSecondary" variant="caption">
          App version: {sourceVersion.substring(0, 8)}
        </Typography>
      </Wrapper>
    ) : null
  }
}
