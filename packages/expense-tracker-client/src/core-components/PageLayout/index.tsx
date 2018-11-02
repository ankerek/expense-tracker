import * as React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { SidebarDrawer } from '@core-components/SidebarDrawer'
import { AppBar, MainContent, ToolbarLeftIcon, Wrapper } from './elements'
import { withRouter, RouteComponentProps } from 'react-router'

interface PageLayoutProps extends RouteComponentProps {
  title: React.ReactNode
  hasGoBack?: boolean
}

interface PageLayoutState {
  drawerOpen: boolean
}

class C extends React.PureComponent<PageLayoutProps, PageLayoutState> {
  state = {
    drawerOpen: false,
  }

  handleToggleDrawer = () => {
    this.setState(({ drawerOpen }) => ({ drawerOpen: !drawerOpen }))
  }

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    const { title, hasGoBack, children } = this.props
    const { drawerOpen } = this.state

    return (
      <Wrapper>
        <AppBar drawerOpen={drawerOpen}>
          <Toolbar>
            {hasGoBack ? (
              <ToolbarLeftIcon onClick={this.goBack}>
                <ChevronLeftIcon />
              </ToolbarLeftIcon>
            ) : (
              <ToolbarLeftIcon onClick={this.handleToggleDrawer}>
                <MenuIcon />
              </ToolbarLeftIcon>
            )}
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

export const PageLayout = withRouter(C)
