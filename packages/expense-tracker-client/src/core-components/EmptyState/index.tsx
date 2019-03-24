import React from 'react'
import { Wrapper } from './elements'
import Typography from '@material-ui/core/Typography'

interface EmptyStateProps {
  title: React.ReactNode
}

export class EmptyState extends React.PureComponent<EmptyStateProps> {
  render() {
    const { title } = this.props
    return (
      <Wrapper>
        <Typography variant="h4">{title}</Typography>
      </Wrapper>
    )
  }
}
