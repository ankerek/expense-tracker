import * as React from 'react'
import styled from 'styled-components'
import MUAppBar, { AppBarProps } from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import { SidebarDrawer, DRAWER_WIDTH } from '@core-components/SidebarDrawer'
import { Routes } from '@pages/Routes'
import CssBaseline from "@material-ui/core/CssBaseline";

const Container = styled.div`
  display: flex;
`

const AppBar = styled<{ drawerOpen: boolean } & AppBarProps>(
  ({ drawerOpen, ...rest }) => <MUAppBar {...rest} />
)`
  && {
    z-index: 1300;
    margin-left: ${props => (props.drawerOpen ? DRAWER_WIDTH : 0)};
    width: ${props =>
      props.drawerOpen ? `calc(100% - ${DRAWER_WIDTH})` : '100%'};
  }
`

const MainContent = styled.main`
  height: 100vh;
  flex-grow: 1;
  padding: 80px 20px 0 20px;
  overflow: auto;
`

interface State {
  drawerOpen: boolean
}

export class MainLayout extends React.Component<{}, State> {
  state = {
    drawerOpen: false,
  }

  handleToggleDrawer = () => {
    this.setState(({ drawerOpen }) => ({ drawerOpen: !drawerOpen }))
  }

  render() {
    const { drawerOpen } = this.state
    return (
      <Container>
        <CssBaseline />
        <AppBar drawerOpen={drawerOpen}>
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleToggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit">
              News
            </Typography>
          </Toolbar>
        </AppBar>
        <SidebarDrawer
          drawerOpen={drawerOpen}
          handleToggleDrawer={this.handleToggleDrawer}
        />
        <MainContent>
          <Routes />
        </MainContent>
      </Container>
    )
  }
}
