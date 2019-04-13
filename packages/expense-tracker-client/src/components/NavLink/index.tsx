import React from 'react'
import styled from 'styled-components'
import { NavLink as BaseNavLink, NavLinkProps } from 'react-router-dom'

const StyledLink = styled(BaseNavLink)`
  color: rgba(0, 0, 0, 0.87);
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

export class NavLink extends React.PureComponent<NavLinkProps> {
  render() {
    return <StyledLink {...this.props} />
  }
}
