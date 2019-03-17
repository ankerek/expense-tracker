import React from 'react'
import styled from 'styled-components'
import MUIAppBar, { AppBarProps } from '@material-ui/core/AppBar/AppBar'
import MUIToolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'

export const Wrapper = styled.div`
  display: flex;
`

export const AppBar = styled((({ drawerOpen, ...rest }) => (
  <MUIAppBar {...rest} />
)) as React.FunctionComponent<{ drawerOpen: boolean } & AppBarProps>)`
  && {
    z-index: 1300;
  }
`

export const Toolbar = styled(MUIToolbar)`
  && {
    min-height: 56px;
  }
`

export const MainContent = styled.div<{
  hasSidebar?: boolean
}>`
  height: calc(100% - 56px);
  flex-grow: 1;
  padding-top: 60px;

  @media (min-width: ${props => props.theme.breakpoints.values.md}px) {
    margin-left: ${props => (props.hasSidebar ? '250px' : '')};
    padding: 80px 20px 0 20px;
  }
`

export const ToolbarLeftIcon = styled(IconButton)`
  && {
    margin-left: -20px;
    color: inherit;
  }
`

export const ToolbarLeftIconEmpty = styled.div`
  width: 28px;
  height: 28px;
`
