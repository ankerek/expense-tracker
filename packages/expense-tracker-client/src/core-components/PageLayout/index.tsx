import * as React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import { SidebarDrawer } from '@core-components/SidebarDrawer'
import { AppBar, MainContent, Wrapper } from './elements'

interface PageLayoutProps {
  title: React.ReactNode
}

interface PageLayoutState {
  drawerOpen: boolean
}

export class PageLayout extends React.PureComponent<
  PageLayoutProps,
  PageLayoutState
> {
  state = {
    drawerOpen: false,
  }

  handleToggleDrawer = () => {
    this.setState(({ drawerOpen }) => ({ drawerOpen: !drawerOpen }))
  }

  render() {
    const { title, children } = this.props
    const { drawerOpen } = this.state

    return (
      <Wrapper>
        <AppBar drawerOpen={drawerOpen}>
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleToggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <SidebarDrawer
          drawerOpen={drawerOpen}
          handleToggleDrawer={this.handleToggleDrawer}
        />
        <MainContent>{children}</MainContent>
      </Wrapper>
    )
  }
}
