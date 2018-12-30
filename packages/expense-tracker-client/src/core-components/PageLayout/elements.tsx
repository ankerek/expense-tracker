import * as React from 'react'
import styled from 'styled-components'
import MUAppBar, { AppBarProps } from '@material-ui/core/AppBar/AppBar'
import { DRAWER_WIDTH } from '@core-components/SidebarDrawer'
import IconButton from '@material-ui/core/IconButton'

export const Wrapper = styled.div`
  display: flex;
`

export const AppBar = styled((({ drawerOpen, ...rest }) => (
  <MUAppBar {...rest} />
)) as React.FunctionComponent<{ drawerOpen: boolean } & AppBarProps>)`
  && {
    z-index: 1300;
    margin-left: ${props => (props.drawerOpen ? DRAWER_WIDTH : 0)};
    width: ${props =>
      props.drawerOpen ? `calc(100% - ${DRAWER_WIDTH})` : '100%'};
  }
`

export const MainContent = styled.main`
  height: 100vh;
  flex-grow: 1;
  padding: 80px 20px 0 20px;
  overflow: auto;
`

export const ToolbarLeftIcon = styled(IconButton)`
  && {
    margin-left: -10px;
    color: inherit;
  }
`
