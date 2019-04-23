import React from 'react'
import { Wrapper, BodyWrapper } from './elements'
import Typography from '@material-ui/core/Typography'

interface EmptyStateProps {
  title: React.ReactNode
  body?: React.ReactNode
}

export class EmptyState extends React.PureComponent<EmptyStateProps> {
  render() {
    const { title, body } = this.props
    return (
      <Wrapper>
        <Typography variant="h4">{title}</Typography>
        {!!body && <BodyWrapper>{body}</BodyWrapper>}
      </Wrapper>
    )
  }
}
