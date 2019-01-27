import React from 'react'
import styled from 'styled-components'
import MUAppBar, { AppBarProps } from '@material-ui/core/AppBar/AppBar'
import IconButton from '@material-ui/core/IconButton'

export const Wrapper = styled.div`
  display: flex;
`

export const AppBar = styled((({ drawerOpen, ...rest }) => (
  <MUAppBar {...rest} />
)) as React.FunctionComponent<{ drawerOpen: boolean } & AppBarProps>)`
  && {
    z-index: 1300;
  }
`

export const MainContent = styled.main`
  height: 100vh;
  flex-grow: 1;
  padding-top: 60px;
  overflow: auto;

  @media (min-width: ${props => props.theme.breakpoints.values.md}px) {
    padding: 80px 20px 0 20px;
  }
`

export const ToolbarLeftIcon = styled(IconButton)`
  && {
    margin-left: -20px;
    color: inherit;
  }
`
