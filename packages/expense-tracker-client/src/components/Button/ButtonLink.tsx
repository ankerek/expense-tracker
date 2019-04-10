import React from 'react'
import MuiButton, { ButtonProps } from '@material-ui/core/Button'
import { NavLink } from '@components/NavLink'
import { LocationDescriptor } from 'history'

interface Props extends ButtonProps {
  to: LocationDescriptor
}

const createLink = ({ innerRef, ...props }: Props) => <NavLink {...props} />

export class ButtonLink extends React.PureComponent<Props> {
  render() {
    return <MuiButton {...this.props} component={createLink} />
  }
}
