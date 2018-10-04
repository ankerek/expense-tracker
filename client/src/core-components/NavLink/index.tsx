import * as React from 'react'
import styled from 'styled-components'
import { NavLink as BaseNavLink, NavLinkProps } from 'react-router-dom'

const StyledLink = styled(BaseNavLink)`
  color: ${props => props.theme.palette.primary.main};
`

export class NavLink extends React.PureComponent<NavLinkProps> {
  render() {
    return <StyledLink {...this.props} />
  }
}
